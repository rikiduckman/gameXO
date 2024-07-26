const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  moves: Array,
  size: Number,
  date: { type: Date, default: Date.now },
  winner: String
});

module.exports = mongoose.model('Game', gameSchema);
