const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoute = require("./routes/usersRoute.js");
const playersRoute = require("./routes/playersRoute.js");

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

// Use the routes
app.use('/users', usersRoute);
app.use('/players', playersRoute);

app.listen(3005, () => {
    console.log("Server is running");
});
