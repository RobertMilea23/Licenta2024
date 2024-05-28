const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  height: { type: String, required: true }
}, {
  timestamps: true
});

const playerModel = mongoose.model('players', playerSchema);
module.exports = playerModel;
