const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const userModel = require('./models/User')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://milearobert21:robstud2003@licenta2024.vjkjbpf.mongodb.net/users");

app.post('/register', (req,res) =>{
    userModel.create(req.body)
    .then(users => res.json(users))
    .catch(err=>res.json(err))
})

app.listen(3000, () => {
    console.log("server is running")
})