const Message = require('../models/Message');

// 1. SEND A MESSAGE (Works for both Tenant and Owner)
exports.sendMessage = async (req, res) => {
  try {
    const { propertyId, receiverId, text } = req.body;
    const senderId = req.user.userId;

    if (!propertyId || !receiverId || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({
      property: propertyId,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message sent successfully!',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. GET MESSAGES FOR A CONVERSATION
exports.getMessages = async (req, res) => {
  try {
    const { propertyId, otherUserId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. GET ALL MESSAGES/INBOX FOR LOGGED IN USER (Owner or Tenant)
exports.getMyConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    // Fetch messages where logged in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .populate('property', 'title location')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};