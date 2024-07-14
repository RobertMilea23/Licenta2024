const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const userModel = require('../models/User');

router.post('/Login', (req, res) => {
    const { email, password } = req.body;
  
    userModel.findOne({ email })
      .then(user => {
        if (user) {
          if (user.password === password) {
            res.json({
              message: 'Login successful',
              user: {
                id: user._id,
                email: user.email,
                role: user.role
              }
            });
          } else {
            res.status(400).json({ message: 'Incorrect password' });
          }
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch(err => res.status(500).json({ error: 'Internal Server Error', details: err }));
  });
  

router.post('/Register', (req, res) => {
    const { email, password, confirmPass } = req.body;
  
    if (password !== confirmPass) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    userModel.create({ email, password, confirmPass })
      .then(user => res.json({
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }))
      .catch(err => res.status(400).json({ error: 'Error creating user', details: err }));
  });
  

  router.get('/:userId', (req, res) => {
    const { userId } = req.params;

  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    userModel.findById(userId)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

module.exports = router;
