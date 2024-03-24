const Game = require("../models/Game");
const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const { getBotId } = require("../stockfish/getBot");

let Chess;
async function initializeChess() {
  const chessModule = await import("chess.js");
  Chess = chessModule.Chess;
}
initializeChess();

const createGame = async (req, res) => {
  console.log(req.body);
  let { color, playWith } = req.body;
  const gameState = new Chess();
  let game;
  if (color !== "white" && color !== "black") {
    color = null;
  }
  let botPlayer;
  if (playWith === "computer") {
    botId = await getBotId();
    console.log("Bot ID:", botId);
    botPlayer = { playerID: botId, playerName: "BOT" };
  }
  if (color) {
    let players = [];
    const playerID = req.user.userId;
    const playerName = req.user.name;
    player = { playerID, color, playerName };
    players.push(player);
    let status = "initialized";
    if (playWith === "computer") {
      botPlayer.color = color === "white" ? "black" : "white";
      players.push(botPlayer);
      status = "ongoing";
    }
    game = await Game.create({
      status,
      players,
      gameStatefen: gameState.fen(),
      chat: [],
    });
  } else {
    let players = [];
    if (playWith === "computer") {
      botPlayer.color = Math.floor(Math.random() * 2) ? "white" : "black";
      players.push(botPlayer);
    }
    game = await Game.create({
      status: "initialized",
      players,
      gameStatefen: gameState.fen(),
      chat: [],
    });
  }
  const { _id: gameID } = game;
  return res.status(200).json({ success: true, gameID });
};

const assignPlayer = async (req, res) => {
  const { id: gameID } = req.params;
  const playerID = req.user.userId;
  const playerName = req.user.name;
  const currGame = await Game.findById(gameID);
  if (currGame.players.length == 0) {
    const color = Math.floor(Math.random() * 2) ? "white" : "black";
    player = { playerID, color, playerName };
    let newGame = {
      status: currGame.status,
      players: [player],
      gameStatefen: currGame.gameStatefen,
      chat: currGame.chat,
    };
    await Game.findByIdAndUpdate(gameID, { ...newGame });
    // send the id and color
    return res
      .status(StatusCodes.OK)
      .json({
        type: "player",
        player,
        fen: currGame.gameStatefen,
        chat: currGame.chat,
      });
  }
  if (currGame.players.length == 1) {
    const color = currGame.players[0].color === "white" ? "black" : "white";
    if (playerID === currGame.players[0].playerID) {
      return res
        .status(StatusCodes.OK)
        .json({
          type: "player",
          player: {
            playerID: currGame.players[0].playerID,
            color: currGame.players[0].color,
          },
          fen: currGame.gameStatefen,
          chat: currGame.chat,
        });
    }
    player = { playerID, color, playerName };
    let newGame = {
      status: "ongoing",
      players: [...currGame.players, player],
      gameStatefen: currGame.gameStatefen,
      chat: currGame.chat,
    };
    await Game.findByIdAndUpdate(gameID, newGame);
    // send the id and color
    return res
      .status(StatusCodes.OK)
      .json({
        type: "player",
        player,
        fen: currGame.gameStatefen,
        chat: currGame.chat,
      });
  }
  for (let i = 0; i < 2; i++) {
    if (playerID === currGame.players[i].playerID) {
      return res
        .status(StatusCodes.OK)
        .json({
          type: "player",
          player: {
            playerID: currGame.players[i].playerID,
            color: currGame.players[i].color,
          },
          fen: currGame.gameStatefen,
          chat: currGame.chat,
        });
    }
  }
  // send that its a visitor
  return res
    .status(200)
    .json({ type: "visitor", fen: currGame.gameStatefen, chat: currGame.chat });
};

module.exports = { createGame, assignPlayer };
