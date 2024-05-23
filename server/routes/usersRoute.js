const express = require('express');
const router = express.Router();
const userModel = require('../models/User.js');

// Login route
router.post('/Login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ message: 'Login successful', role: user.role });
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

module.exports = router;