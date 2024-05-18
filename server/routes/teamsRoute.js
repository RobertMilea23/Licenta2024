const express = require('express');
const router = express.Router();
const teamModel = require('../models/Team.js');

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

router.get('/', (req, res) => {
  teamModel.find({})
    .populate('players') // Populate player details
    .then(teams => {
      res.json(teams);
    })
    .catch(err => {
      console.error("Error fetching teams:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = router;
