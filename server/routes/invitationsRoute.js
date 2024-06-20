// routes/invitationsRoute.js
const express = require('express');
const router = express.Router();
const invitationModel = require('../models/Invitation');
const teamModel = require('../models/Team');

// Send invitations to create or add to a team
router.post('/send-invitations', async (req, res) => {
  const { teamName, ownerId, playerIds } = req.body;

  try {
    // Find an existing team with the owner and the provided team name in pending state
    let team = await teamModel.findOne({ owner: ownerId, status: 'pending' });

    // If no such team exists, create a new one
    if (!team) {
      team = new teamModel({ name: teamName, owner: ownerId, players: [ownerId], status: 'pending' });
      await team.save();
    }

    // Send invitations to other players
    const invitations = playerIds.map(playerId => ({
      sender: ownerId,
      recipient: playerId,
      team: team._id
    }));

    await invitationModel.insertMany(invitations);

    res.status(201).json({ team, message: 'Invitations sent.' });
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
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      if (!team.players.includes(invitation.recipient)) {
        team.players.push(invitation.recipient);

        if (team.players.length === 3) {
          team.status = 'formed';
        }
        await team.save();
      }
    } else if (response === 'rejected') {
      // No modifications to the team are needed when the invitation is rejected
      console.log(`Invitation ${invitationId} was rejected by ${invitation.recipient}`);
    }

    res.status(200).json({ message: 'Response recorded', status: invitation.status });
  } catch (err) {
    console.error("Error responding to invitation:", err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Fetch invitations for a user
router.get('/:userId', (req, res) => {
  invitationModel.find({ recipient: req.params.userId })
    .populate('sender', 'email')
    .populate('team', 'name')
    .then(invitations => res.json(invitations))
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

module.exports = router;
