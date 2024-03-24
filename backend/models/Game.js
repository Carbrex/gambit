const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["initialized", "ongoing", "ended"],
    required: [true, "Please provide status"],
  },
  players: {
    type: [
      {
        playerID: { type: String },
        color: { type: String },
        playerName: { type: String },
      },
    ],
    required: [true, "Please provide players"],
    maxLength: 2,
  },
  gameStatefen: String,
  chat: {
    type: [
      {
        name: { type: String },
        text: { type: String },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Game", GameSchema);
