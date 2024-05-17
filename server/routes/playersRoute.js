const express = require('express');
const router = express.Router();
const playerModel = require('../models/Player.js');

// Create player route
router.post('/Players', (req, res) => {
    const { name, position, height } = req.body; // Include height in the destructuring
    playerModel.create({ name, position, height }) // Pass height to create method
        .then(players => res.json(players))
        .catch(err => res.json(err));
});

// Count players route
router.get('/countPlayers', (req, res) => {
    playerModel.countDocuments({})
        .then(count => {
            res.json({ count });
        })
        .catch(err => {
            console.error("Error fetching player count:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Fetch all players route (nou)
router.get('/allPlayers', (req, res) => {
    playerModel.find({})
        .then(players => res.json(players))
        .catch(err => res.status(500).json(err));
});



module.exports = router;
