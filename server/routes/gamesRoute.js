const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Team = require('../models/Team');

// Fetch confirmed games for a team
router.get('/confirmed/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const games = await Game.find({ 
      $or: [{ homeTeam: teamId }, { awayTeam: teamId }], 
      status: 'confirmed' 
    }).populate('homeTeam', 'name').populate('awayTeam', 'name');

    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching confirmed games:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/open/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const games = await Game.find({ 
      awayTeam: null, 
      status: 'open', 
      homeTeam: { $ne: teamId } 
    }).populate('homeTeam', 'name');
      
    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching open games:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/invitations/:teamId', async (req, res) => {
  try {
    const games = await Game.find({ awayTeam: req.params.teamId, status: 'pending' })
      .populate('homeTeam', 'name')
      .populate('awayTeam', 'name');
    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching game invitations:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/invitations/respond', async (req, res) => {
  const { gameId, response } = req.body;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (!['confirmed', 'denied'].includes(response)) {
      return res.status(400).json({ error: 'Invalid response' });
    }

    game.status = response;
    await game.save();

    res.status(200).json({ message: 'Response recorded', status: game.status });
  } catch (err) {
    console.error("Error responding to game invitation:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Accept open game
router.post('/accept-open', async (req, res) => {
  try {
    const { gameId, teamId } = req.body;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.awayTeam) {
      return res.status(400).json({ error: 'Game already has an away team' });
    }

    // Ensure that the accepting team is not the same as the home team
    if (game.homeTeam.toString() === teamId) {
      return res.status(400).json({ error: 'Home team cannot accept its own open game' });
    }

    game.awayTeam = teamId;
    game.status = 'confirmed';
    await game.save();

    res.status(200).json({ message: 'Game accepted', game });
  } catch (err) {
    console.error("Error accepting open game:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Decline open game
router.post('/decline-open', async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.status = 'cancelled';
    await game.save();

    res.status(200).json({ message: 'Game declined', game });
  } catch (err) {
    console.error("Error declining open game:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to check for time conflicts
const isTimeConflict = (existingTime, newTime) => {
  const [existingHour, existingMinute] = existingTime.split(':').map(Number);
  const [newHour, newMinute] = newTime.split(':').map(Number);

  const existingDate = new Date();
  existingDate.setHours(existingHour, existingMinute, 0, 0);

  const newDate = new Date();
  newDate.setHours(newHour, newMinute, 0, 0);

  const diff = Math.abs(newDate - existingDate);
  return diff < 60 * 60 * 1000; // 1 hour
};

// Route to create a new game
router.post('/create', async (req, res) => {
  try {
    const { homeTeam, awayTeam, date, time, court } = req.body;

    // Check if the teams exist
    const homeTeamExists = await Team.findById(homeTeam);
    if (!homeTeamExists) {
      return res.status(404).json({ error: 'Home team does not exist.' });
    }
    
    if (awayTeam) {
      const awayTeamExists = await Team.findById(awayTeam);
      if (!awayTeamExists) {
        return res.status(404).json({ error: 'Away team does not exist.' });
      }
    }

    // Check for existing games at the same court and date with conflicting times
    const existingGames = await Game.find({ court, date });

    for (let game of existingGames) {
      if (isTimeConflict(game.time, time)) {
        return res.status(400).json({ error: 'Time conflict with another game at the same court.' });
      }
    }

    // Create a new game
    const newGame = new Game({ 
      homeTeam, 
      awayTeam: awayTeam || null, 
      date, 
      time, 
      court, 
      status: awayTeam ? 'pending' : 'open' 
    });
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
