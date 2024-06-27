const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team');
const invitationModel = require('../models/Invitation');
const userModel = require('../models/User');
const playerModel = require('../models/Player');

// Fetch all teams with player details
router.get('/', async (req, res) => {
  try {
    const teams = await teamModel.find().populate('players', 'email name'); 
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/send-invitations', async (req, res) => {
  const { teamName, ownerId, playerIds } = req.body;
  try {
    let team = await teamModel.findOne({ owner: ownerId });

    if (team && team.players.length + playerIds.length > 3) {
      return res.status(400).json({ error: 'A team cannot have more than 3 players, including the owner.' });
    }
    const existingTeams = await teamModel.find({ players: { $in: playerIds } });
    if (existingTeams.length > 0) {
      return res.status(400).json({ error: 'One or more players are already in a team.' });
    }
    if (!team) {
      const existingTeamName = await teamModel.findOne({ name: teamName });
      if (existingTeamName) {
        return res.status(400).json({ error: 'Team name is already taken.' });
      }
      team = new teamModel({ name: teamName, owner: ownerId, players: [ownerId] });
      await team.save();
    }
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

router.post('/invitations/respond', async (req, res) => {
  const { invitationId, response } = req.body;

  try {
    const invitation = await invitationModel.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    if (response === 'accepted') {
      const team = await teamModel.findById(invitation.team);
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


router.get('/invitations/:userId', (req, res) => {
  invitationModel.find({ recipient: req.params.userId })
    .populate('sender', 'email')
    .populate('team', 'name')
    .then(invitations => res.json(invitations))
    .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
});

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

router.post('/leave-team', async (req, res) => {
  const { userId } = req.body;

  try {
    const team = await teamModel.findOne({ players: userId });
    if (!team) {
      return res.status(404).json({ error: 'User is not part of any team.' });
    }

    team.players = team.players.filter(playerId => playerId.toString() !== userId);
    await team.save();

    if (team.owner.toString() === userId) {
      await teamModel.findByIdAndDelete(team._id);
    }

    res.status(200).json({ message: 'You have left the team.' });
  } catch (err) {
    console.error("Error leaving team:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all players who are not part of any team
router.get('/available-players', async (req, res) => {
  try {
    const playersInTeams = await teamModel.distinct('players');
    const availablePlayers = await playerModel.find({ _id: { $nin: playersInTeams } });
    res.status(200).json(availablePlayers);
  } catch (err) {
    console.error("Error fetching available players:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Count teams
router.get('/countTeams', async (req, res) => {
  try {
    const count = await teamModel.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;