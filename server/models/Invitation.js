const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  createdAt: { type: Date, default: Date.now },
});

const invitationModel = mongoose.model('invitations', invitationSchema);
module.exports = invitationModel;
