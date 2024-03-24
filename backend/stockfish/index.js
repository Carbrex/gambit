const uci = require("node-uci");
const Game = require("../models/Game");
const { getBotId } = require("./getBot");
require("dotenv").config();

let engine;
let Chess;
async function initializeChess() {
  const chessModule = await import("chess.js");
  Chess = chessModule.Chess;
}
initializeChess();

async function initializeEngine() {
  engine = new uci.Engine("stockfish");
  await engine.init();
  await engine.isready();
  await engine.setoption("MultiPV", "1"); // MultiPV: Number of variations to display
}

async function getBestMove(fen, depth) {
  await engine.position(fen);
  const result = await engine.go({ depth });
  return result.bestmove;
}

const isBotGame = async (game) => {
  const botId = await getBotId();
  for (let player of game.players) {
    if (player.playerID == botId) {
      return true;
    }
  }
  return false;
};

const playBotMove = async (game) => {
  if (process.env.STOCKFISH === "false") {
    let gameState = new Chess(game.gameStatefen);
    let moves = gameState.moves();
    let move = moves[Math.floor(Math.random() * moves.length)];
    return move;
  }
  if (!engine) {
    await initializeEngine();
  }
  fen = game.gameStatefen;
  const bestMove = await getBestMove(fen, 10);
  return bestMove;
};

module.exports = { isBotGame, playBotMove };
