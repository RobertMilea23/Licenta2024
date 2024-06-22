const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: false }, // Changed from required: true to required: false
  date: { type: Date, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'denied', 'open', 'cancelled'], default: 'pending' } // Added 'open' and 'cancelled'
}, { timestamps: true });

const gameModel = mongoose.model('games', gameSchema);
module.exports = gameModel;
