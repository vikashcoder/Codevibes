const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

module.exports = (upload) => {
  router.post('/register', async (req, res) => {
    try {
      const { username, password, email, gender } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const maleAvatars = [
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg',
      ];
      const femaleAvatars = [
        'https://randomuser.me/api/portraits/women/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/women/3.jpg',
      ];

      const avatarList = gender === 'male' ? maleAvatars : femaleAvatars;
      const avatar = avatarList[Math.floor(Math.random() * avatarList.length)];

      const user = new User({ username, password: hashedPassword, email, gender, avatar });
      await user.save();
      res.status(201).json({ message: 'User registered' });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  router.get('/profile', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Server error while fetching profile' });
    }
  });

  router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
    try {
      const { username, email, gender, password } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

      // Update fields if provided
      if (username) {
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        user.username = username;
      }
      if (email !== undefined) user.email = email;
      if (gender) {
        user.gender = gender;
        // Only update avatar based on gender if no file is uploaded
        if (!req.file) {
          const maleAvatars = [
            'https://randomuser.me/api/portraits/men/1.jpg',
            'https://randomuser.me/api/portraits/men/2.jpg',
            'https://randomuser.me/api/portraits/men/3.jpg',
          ];
          const femaleAvatars = [
            'https://randomuser.me/api/portraits/women/1.jpg',
            'https://randomuser.me/api/portraits/women/2.jpg',
            'https://randomuser.me/api/portraits/women/3.jpg',
          ];
          const avatarList = gender === 'male' ? maleAvatars : femaleAvatars;
          user.avatar = avatarList[Math.floor(Math.random() * avatarList.length)];
        }
      }
      if (req.file) {
        user.avatar = `/uploads/${req.file.filename}`; // Save uploaded file path
      }

      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  });

  return router;
};