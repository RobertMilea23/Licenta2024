const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team');
const invitationModel = require('../models/Invitation');

// Send invitations to create or update a team
router.post('/send-invitations', async (req, res) => {
  const { teamName, ownerId, playerIds } = req.body;

  try {
    let team = await teamModel.findOne({ owner: ownerId });

    if (!team) {
      // Create a new team if one doesn't exist
      team = new teamModel({ name: teamName, owner: ownerId, players: [ownerId] });
      await team.save();
    }

    // Check if players are already in a team
    const existingTeams = await teamModel.find({ players: { $in: playerIds } });
    if (existingTeams.length > 0) {
      return res.status(400).json({ error: 'One or more players are already in a team.' });
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
router.post('/invitations/respond', async (req, res) => {
  const { invitationId, response } = req.body;

  try {
    const invitation = await invitationModel.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (response === 'accepted') {
      const team = await teamModel.findById(invitation.team);

      // Check if the player is already part of a team
      const existingTeam = await teamModel.findOne({ players: invitation.recipient });
      if (existingTeam) {
        return res.status(400).json({ error: 'You are already part of a team.' });
      }

      team.players.push(invitation.recipient);
      await team.save();
    }

    invitation.status = response;
    await invitation.save();

    res.status(200).json({ message: 'Response recorded', status: invitation.status });
  } catch (err) {
    console.error("Error responding to invitation:", err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Fetch invitations for a user
router.get('/invitations/:userId', (req, res) => {
  invitationModel.find({ recipient: req.params.userId })
    .populate('sender', 'email')
    .populate('team', 'name')
    .then(invitations => res.json(invitations))
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

// Fetch team details for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const team = await teamModel.findOne({ players: req.params.userId })
      .populate('owner', 'email')
      .populate('players', 'email');
    if (!team) {
      return res.status(404).json({ error: 'No team found for the user' });
    }
    res.json(team);
  } catch (err) {
    console.error("Error fetching user's team:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch basic team information for a specific user
router.get('/user-simple/:userId', async (req, res) => {
  try {
    const team = await teamModel.findOne({ players: req.params.userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found for this user' });
    }
    res.status(200).json(team);
  } catch (err) {
    console.error("Error fetching user's team:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await teamModel.find({});
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Leave team
router.post('/leave-team', async (req, res) => {
  const { userId } = req.body;

  try {
    const team = await teamModel.findOne({ players: userId });
    if (!team) {
      return res.status(404).json({ error: 'User is not part of any team.' });
    }

    // Remove user from the team
    team.players = team.players.filter(playerId => playerId.toString() !== userId);
    await team.save();

    // Optionally, you can delete the team if no players are left
    if (team.players.length === 0) {
      await teamModel.findByIdAndDelete(team._id);
    }

    res.status(200).json({ message: 'You have left the team.' });
  } catch (err) {
    console.error("Error leaving team:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
