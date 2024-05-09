const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/User.js");
const playerModel = require("./models/Player.js");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://milearobert21:robstud2003@licenta2024.vjkjbpf.mongodb.net/managingBasketballApp")
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(() => {
        console.log("Failed to connect to the database");
    });

app.post('/Login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json('Login successful');
                } else {
                    res.json('Incorrect password');
                }
            } else {
                res.json('User not found');
            }
        });
});

app.post('/Register', (req, res) => {
    userModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err));
});





app.post('/Players', (req, res) => {
    const { name, position } = req.body;
    playerModel.create(req.body)
        .then(players => res.json(players))
        .catch(err => res.json(err));
});


app.get('/countPlayers', (req, res) => {
    playerModel.countDocuments({})
        .then(count => {
            res.json({ count });
        })
        .catch(err => {
            console.error("Error fetching player count:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



app.listen(3005, () => {
    console.log("server is running");
});
