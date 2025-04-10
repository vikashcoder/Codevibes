
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Optional, unique if provided
  gender: { type: String, enum: ['male', 'female'], required: true },
  avatar: { type: String, default: '' },
});

module.exports = mongoose.model('User', userSchema);