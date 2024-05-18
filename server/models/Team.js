const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: String,
  description: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'players' }] // Array of player IDs
});

const teamModel = mongoose.model('teams', teamSchema);
module.exports = teamModel;
