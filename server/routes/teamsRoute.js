const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team.js');

// Create team route
router.post('/create', (req, res) => {
    const { teamName, players } = req.body;

    if (players.length !== 3) {
        return res.status(400).json({ error: 'A team must have exactly 3 players.' });
    }

    teamModel.create({ name: teamName, players })
        .then(team => res.json(team))
        .catch(err => res.status(500).json(err));
});

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

module.exports = router;
