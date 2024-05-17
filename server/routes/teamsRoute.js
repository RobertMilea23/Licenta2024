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

module.exports = router;
