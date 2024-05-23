const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPass: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' } // Add role field
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;