




const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  try {
    const sessionId = req.body.sessionId || uuidv4();
    const session = new Session({
      sessionId,
      creator: req.user.id,
      participants: [req.user.id],
    });
    await session.save();
    const populatedSession = await Session.findOne({ sessionId }).populate('creator', 'username avatar');
    res.json({ sessionId, creator: populatedSession.creator });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findOne({ sessionId }).populate('creator', 'username avatar');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (!session.participants.includes(req.user.id)) {
      session.participants.push(req.user.id);
      await session.save();
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-code', auth, async (req, res) => {
  try {
    const { sessionId, code } = req.body;
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.code = code;
    await session.save();
    res.json({ message: 'Code updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;