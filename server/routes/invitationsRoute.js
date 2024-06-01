// routes/invitationsRoute.js
const express = require('express');
const router = express.Router();
const invitationModel = require('../models/Invitation');
const teamModel = require('../models/Team');

// Send invitations to create a team
router.post('/send-invitations', async (req, res) => {
  const { teamName, ownerId, playerIds } = req.body;

  try {
    // Create a new team with only the owner as the member initially
    const newTeam = new teamModel({ name: teamName, owner: ownerId, players: [ownerId] });
    await newTeam.save();

    // Send invitations to other players
    const invitations = playerIds.map(playerId => ({
      sender: ownerId,
      recipient: playerId,
      team: newTeam._id
    }));

    await invitationModel.insertMany(invitations);

    res.status(201).json({ team: newTeam, message: 'Invitations sent.' });
  } catch (err) {
    console.error("Error sending invitations:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
