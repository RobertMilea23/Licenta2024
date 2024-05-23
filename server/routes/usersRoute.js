// routes/usersRoute.js

const express = require('express');
const router = express.Router();
const userModel = require('../models/User.js');

// Get user by ID
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  userModel.findById(userId)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Internal Server Error', error: err }));
});

// Other routes (Login, Register, etc.)
router.post('/Login', (req, res) => {
  const { email, password } = req.body;
  userModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json({ message: 'Login successful', user });
        } else {
          res.json({ message: 'Incorrect password' });
        }
      } else {
        res.json({ message: 'User not found' });
      }
    });
});

router.post('/Register', (req, res) => {
  userModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

module.exports = router;
