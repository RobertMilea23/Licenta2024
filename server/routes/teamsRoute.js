const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team');
const invitationModel = require('../models/Invitation');
const userModel = require('../models/User'); // Import the userModel
const playerModel = require('../models/Player');



router.get('/', async (req, res) => {
  try {
    const teams = await teamModel.find().populate('players', 'email name'); // Populate players with email and name or any other required fields
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Send invitations to create or update a team
router.post('/send-invitations', async (req, res) => {
  const { teamName, ownerId, playerIds } = req.body;

  try {
    let team = await teamModel.findOne({ owner: ownerId });

    // Check if the team already has players and if the total exceeds 3 (including the owner)
    if (team && team.players.length + playerIds.length > 3) {
      return res.status(400).json({ error: 'A team cannot have more than 3 players, including the owner.' });
    }

    // Check if the invited players are already in other teams
    const existingTeams = await teamModel.find({ players: { $in: playerIds } });
    if (existingTeams.length > 0) {
      return res.status(400).json({ error: 'One or more players are already in a team.' });
    }

    if (!team) {
      // Create a new team if one doesn't exist
      const existingTeamName = await teamModel.findOne({ name: teamName });
      if (existingTeamName) {
        return res.status(400).json({ error: 'Team name is already taken.' });
      }

      team = new teamModel({ name: teamName, owner: ownerId, players: [ownerId] });
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

    // Notify team owner if the leaving player is not the owner
    if (team.owner.toString() !== userId) {
      const owner = await userModel.findById(team.owner);
      // Notify owner here (e.g., via email or notification system)
    } else {
      // If the owner leaves, disband the team
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
    // Get all players who are currently in teams
    const playersInTeams = await teamModel.distinct('players');

    // Fetch all players who are not in any team
    const availablePlayers = await playerModel.find({ _id: { $nin: playersInTeams } });

    res.status(200).json(availablePlayers);
  } catch (err) {
    console.error("Error fetching available players:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//countTeams

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