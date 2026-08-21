const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, buyerName, buyerPhone, message, type } = req.body;

    if (!propertyId || !buyerName || !buyerPhone) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newInquiry = new Inquiry({
      property: propertyId,
      buyerName,
      buyerPhone,
      message,
      type: type || 'buy',
    });

    await newInquiry.save();

    res.status(201).json({
      message: 'Inquiry sent successfully!',
      inquiry: newInquiry,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};