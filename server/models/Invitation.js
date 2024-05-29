const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' }
}, {
  timestamps: true
});

const invitationModel = mongoose.model('invitations', invitationSchema);
module.exports = invitationModel;
