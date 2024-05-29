const express = require('express');
const router = express.Router();
const playerModel = require('../models/Player.js');

// Create or update player for a user
router.put('/createOrUpdate', async (req, res) => {
  const { userId, name, position, height } = req.body;

  try {
    let player = await playerModel.findOne({ userId });
    if (player) {
      // Update existing player
      player.name = name;
      player.position = position;
      player.height = height;
      await player.save();
      res.json(player);
    } else {
      // Create new player
      player = new playerModel({ userId, name, position, height });
      await player.save();
      res.json(player);
    }
  } catch (err) {
    console.error("Error creating/updating player:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/user-players', async (req, res) => {
    try {
      const players = await playerModel.find({ userId: { $ne: null } }); // Assuming user-created players have userId
      res.json(players);
    } catch (err) {
      console.error("Error fetching user players:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get player by userId
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const player = await playerModel.findOne({ userId });
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (err) {
    console.error("Error fetching player:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
