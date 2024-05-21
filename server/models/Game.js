const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'teams', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
