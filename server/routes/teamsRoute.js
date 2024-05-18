const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team.js');

// Count teams route
router.get('/countTeams', (req, res) => {
  teamModel.countDocuments({})
    .then(count => {
      res.json({ count });
    })
    .catch(err => {
      console.error("Error fetching team count:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Fetch all teams route
router.get('/', (req, res) => {
  teamModel.find({})
    .populate('players')
    .then(teams => {
      res.json(teams);
    })
    .catch(err => {
      console.error("Error fetching teams:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Create team route
router.post('/create', async (req, res) => {
  const { teamName, players } = req.body;

  try {
    // Check if any player is already part of another team
    const existingTeams = await teamModel.find({ players: { $in: players } });
    if (existingTeams.length > 0) {
      return res.status(400).json({ error: 'One or more players are already assigned to another team.' });
    }

    const newTeam = new teamModel({ name: teamName, players });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
