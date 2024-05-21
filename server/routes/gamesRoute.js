const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Team = require('../models/Team');  // Correctly import the Team model

// Route to create a new game
router.post('/create', async (req, res) => {
  try {
    const { homeTeam, awayTeam, date, time, court } = req.body;

    // Validate that homeTeam and awayTeam are different
    if (homeTeam === awayTeam) {
      return res.status(400).json({ error: 'Home team and away team must be different.' });
    }

    // Check if the teams exist
    const homeTeamExists = await Team.findById(homeTeam);
    const awayTeamExists = await Team.findById(awayTeam);

    if (!homeTeamExists || !awayTeamExists) {
      return res.status(404).json({ error: 'One or both of the teams do not exist.' });
    }

    // Create a new game
    const newGame = new Game({ homeTeam, awayTeam, date, time, court });
    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all games
router.get('/all', async (req, res) => {
  try {
    const games = await Game.find().populate('homeTeam awayTeam');
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
