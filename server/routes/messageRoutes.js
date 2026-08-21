const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET ALL conversations for logged-in user (Inbox)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });

    return res.json(messages);
  } catch (error) {
    console.error('Fetch Inbox Error:', error);
    return res.status(500).json({ message: 'Error fetching inbox messages' });
  }
});

// 2. GET chat history for a property between logged-in user and counterparty
router.get('/:propertyId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid Property ID' });
    }

    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error('Fetch Chat Error:', error);
    return res.status(500).json({ message: 'Error fetching chat' });
  }
});

// 3. POST save new message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id || req.user._id;
    let { propertyId, receiverId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text cannot be empty' });
    }

    if (typeof receiverId === 'object' && receiverId !== null) {
      receiverId = receiverId._id || receiverId.id;
    }

    if (!propertyId || !receiverId) {
      return res.status(400).json({ message: 'Property ID and Receiver ID are required' });
    }

    const newMessage = new Message({
      property: new mongoose.Types.ObjectId(String(propertyId)),
      sender: new mongoose.Types.ObjectId(String(senderId)),
      receiver: new mongoose.Types.ObjectId(String(receiverId)),
      text: text.trim()
    });

    const savedMessage = await newMessage.save();

    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .populate('property', 'title location price');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send Message Error:', error);
    return res.status(500).json({ message: error.message || 'Server error while sending message' });
  }
});

module.exports = router;