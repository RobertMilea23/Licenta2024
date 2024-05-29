const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

const teamModel = mongoose.model('teams', teamSchema);
module.exports = teamModel;
