const express = require('express');
const router = express.Router();
const invitationModel = require('../models/Invitation');
const teamModel = require('../models/Team');

// Handle invitation response
router.post('/respond', async (req, res) => {
  const { invitationId, response } = req.body;

  try {
    const invitation = await invitationModel.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    invitation.status = response;
    await invitation.save();

    if (response === 'accepted') {
      const team = await teamModel.findById(invitation.team);
      team.players.push(invitation.recipient);
      await team.save();
    }

    res.status(200).json({ message: 'Response recorded', status: invitation.status });
  } catch (err) {
    console.error("Error responding to invitation:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch invitations for a user
router.get('/:userId', (req, res) => {
  invitationModel.find({ recipient: req.params.userId })
    .populate('sender', 'email')
    .populate('team', 'name')
    .then(invitations => res.json(invitations))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
