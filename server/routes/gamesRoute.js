const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Team = require('../models/Team');

// Helper function to check for time conflicts
const isTimeConflict = (existingTime, newTime) => {
  const [existingHour, existingMinute] = existingTime.split(':').map(Number);
  const [newHour, newMinute] = newTime.split(':').map(Number);
  
  const existingDate = new Date();
  existingDate.setHours(existingHour, existingMinute, 0, 0);
  
  const newDate = new Date();
  newDate.setHours(newHour, newMinute, 0, 0);
  
  const diff = Math.abs(newDate - existingDate);
  return diff < 60 * 60 * 1000; 
};

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

    // Check for existing games at the same court and date with conflicting times
    const existingGames = await Game.find({ court, date });

    for (let game of existingGames) {
      if (isTimeConflict(game.time, time)) {
        return res.status(400).json({ error: 'Time conflict with another game at the same court.' });
      }
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

// Route to get games by date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const games = await Game.find({ date: { $eq: date } }).populate('homeTeam awayTeam');
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
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
