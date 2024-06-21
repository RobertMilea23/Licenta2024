// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'denied'], default: 'pending' }
}, { timestamps: true });

const gameModel = mongoose.model('games', gameSchema);
module.exports = gameModel;
