const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Game schema
const gameSchema = new Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the Game model
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
