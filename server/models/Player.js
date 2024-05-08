const mongoose = require('mongoose')


const playerSchema = new mongoose.Schema({
    name: String,
    position:String,
    
})

const playerModel = mongoose.model('players', playerSchema)
module.exports = playerModel;

