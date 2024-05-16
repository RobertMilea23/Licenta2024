const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: String,
    position: String,
    height: Number // Add the height field here
});

const playerModel = mongoose.model('players', playerSchema);
module.exports = playerModel;