const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team.js');

// Create team route
router.post('/create', (req, res) => {
    const { teamName, players } = req.body;
    teamModel.create({ name: teamName, players })
        .then(team => res.json(team))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
