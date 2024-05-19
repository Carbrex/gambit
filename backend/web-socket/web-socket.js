// WebSocket server
const jwt = require("jsonwebtoken");

// Store active games
const games = new Map();

// Middleware function for WebSocket connections
function authenticateWebSocketConnection(ws, req, next) {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authentication Invalid"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
}

const WebSocket = require("ws");
const Game = require("../models/Game");
const { isBotGame, playBotMove } = require("../stockfish");
const { getBotId } = require("../stockfish/getBot");
let Chess;
async function initializeChess() {
  const chessModule = await import("chess.js");
  Chess = chessModule.Chess;
}
initializeChess();

async function playBotMoveHelper(currGame, connections) {
  try {
    let gameIncludingBot = await isBotGame(currGame);
    if (gameIncludingBot) {
      // check if it is bot's turn
      let chess = new Chess(currGame.gameStatefen);
      // get bot color
      let botColor;
      let botId = await getBotId();
      for (let player of currGame.players) {
        if (player.playerID == botId) {
          botColor = player.color;
          break;
        }
      }
      if (!botColor) {
        return;// This should never happen
      }
      if (chess.turn() === botColor.slice(0, 1).toLowerCase()) {
        // make bot move
        const botMove = await playBotMove(currGame);
        const move = chess.move(botMove);
        if (chess.isGameOver()) {
          currGame.status = "ended";
        }
        currGame.gameStatefen = chess.fen();
        await currGame.save();
        connections.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "move",
                payload: move,
                gameStatefen: currGame.gameStatefen,
              })
            );
          }
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

const wss = new WebSocket.Server({ noServer: true });
wss.on("connection", async (ws, req) => {
  try {
    // Get game ID from URL
    const gameReq = req.url.split("/").pop();
    const gameID = gameReq.split("?")[0];
    const token = new URLSearchParams(req.url.split("?")[1]).get("token");
    req.headers.authorization = `Bearer ${token}`;
    const currGame = await Game.find({ _id: `${gameID}` });
    if (!currGame) {
      ws.send("Invalid Game");
      ws.close();
      return;
    }
    authenticateWebSocketConnection(ws, req, async (err) => {
      try {
        if (err) {
          ws.send("Unauthenticated User");
          ws.close();
        }
        // Create new game if it doesn't exist
        if (!games.has(gameID)) {
          games.set(gameID, []);
        }
        games.get(gameID).push(ws);
        const players = games.get(gameID);
        const connections = games.get(gameID);
        const currGame = await Game.findById(gameID);
        connections.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "joined",
                gameStatus: currGame.status,
                players: currGame.players,
              })
            );
          }
        });
        await playBotMoveHelper(currGame, connections);
        // Listen for messages
        ws.on("message", async (message) => {
          try {
            // Parse message as JSON
            const msg = JSON.parse(message);
            if (msg.type === "move") {
              // Get the game object from the database
              const currGame = await Game.findById(gameID);
              if (!currGame) {
                ws.close();
              }
              // Make the move on the game object
              const chess = new Chess(currGame.gameStatefen);
              const move = chess.move(msg.payload);
              if (!move) {
                // Move is not valid, send an error message back to the client
                ws.send(
                  JSON.stringify({ type: "error", payload: "Invalid move" })
                );
                return;
              }
              if (chess.isGameOver()) {
                currGame.status = "ended";
              }
              // Save the updated game object to the database
              currGame.gameStatefen = chess.fen();
              await currGame.save();
              // Broadcast the move to all other clients
              const connections = games.get(gameID);
              connections.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                  client.send(
                    JSON.stringify({
                      type: "move",
                      payload: move,
                      gameStatefen: currGame.gameStatefen,
                    })
                  );
                }
              });
              await playBotMoveHelper(currGame, connections);
            } else if (msg.type === "joined") {
              // Get the game object from the database
              // sleep for 2 sec
              await new Promise((r) => setTimeout(r, 100));
              const currGame = await Game.findById(gameID);
              if (!currGame) {
                ws.close();
              }
              const connections = games.get(gameID);
              connections.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "joined",
                      gameStatus: currGame.status,
                    })
                  );
                }
              });
            } else if (msg.type === "chat") {
              // Get the game object from the database
              const currGame = await Game.findById(gameID);
              if (!currGame) {
                ws.close();
              }
              currGame.chat = [
                ...currGame.chat,
                { name: req.user.name, text: msg.payload },
              ];
              await currGame.save();
              // Broadcast the move to all other clients
              const connections = games.get(gameID);
              connections.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "chat",
                      payload: { name: req.user.name, text: msg.payload },
                    })
                  );
                }
              });
            }
          } catch (err) {
            if (err.name === "CastError") {
              err.msg = `No item found with id ${err.value}`;
            }
            ws.send(
              JSON.stringify({
                status: "failed",
                msg: err.msg || "Something went wrong, try again later",
              })
            );
            ws.close();
          }
        });

        // Listen for connection close
        ws.on("close", () => {
          // Remove connection from the game state
          const index = players.indexOf(ws);
          players.splice(index, 1);
          // Delete the game if there are no more players or viewers
          if (players.length === 0) {
            games.delete(gameID);
          }
        });
      } catch (err) {
        if (err.name === "CastError") {
          err.msg = `No item found with id ${err.value}`;
        }
        ws.send(
          JSON.stringify({
            status: "failed",
            msg: err.msg || "Something went wrong, try again later",
          })
        );
        ws.close();
      }
    });
  } catch (err) {
    if (err.name === "CastError") {
      err.msg = `No item found with id ${err.value}`;
    }
    ws.send(
      JSON.stringify({
        status: "failed",
        msg: err.msg || "Something went wrong, try again later",
      })
    );
    ws.close();
  }
});
wss.on("error", (err) => {
  console.log(err);
});
module.exports = { wss };
