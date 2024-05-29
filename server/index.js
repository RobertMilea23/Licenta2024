const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoute = require('./routes/usersRoute');
const playersRoute = require('./routes/playersRoute');
const teamsRoute = require('./routes/teamsRoute');
const gamesRoute = require('./routes/gamesRoute');
const invitationsRoute = require('./routes/invitationsRoute');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://milearobert21:Floare2003@licenta2024.vjkjbpf.mongodb.net/managingBasketballApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

app.use('/users', usersRoute);
app.use('/players', playersRoute);
app.use('/teams', teamsRoute);
app.use('/games', gamesRoute);
app.use('/invitations', invitationsRoute);

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
