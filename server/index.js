const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")


const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://milearobert21:robstud2003@licenta2024.vjkjbpf.mongodb.net/users");

app.listen(3001, () => {
    console.log("server is running")
})