const express = require('express');
const router = express.Router();
const userModel = require('../models/User');

// Login route
router.post('/Login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({
                        message: 'Login successful',
                        user: {
                            id: user._id,
                            email: user.email,
                            role: user.role // Include role in the response
                        }
                    });
                } else {
                    res.json({ message: 'Incorrect password' });
                }
            } else {
                res.json({ message: 'User not found' });
            }
        });
});

// Register route
router.post('/Register', (req, res) => {
    userModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

// Get user by ID route
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
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

module.exports = router;
