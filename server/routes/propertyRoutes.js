const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL properties with Location Search
router.get('/', async (req, res) => {
  try {
    const { location, propertyType } = req.query;
    let query = {};

    // Match City / Location case-insensitively (e.g., indore matches Indore, Vijay Nagar Indore)
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (propertyType && propertyType !== 'All' && propertyType !== 'All Types') {
      query.propertyType = propertyType;
    }

    const properties = await Property.find(query)
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });

    return res.json(properties);
  } catch (error) {
    console.error('Fetch properties error:', error);
    return res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// GET Single Property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'username email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    return res.json(property);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property' });
  }
});

// POST Property
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      owner: req.user.id || req.user._id
    });
    const saved = await newProperty.save();
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE Property
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Property deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Delete error' });
  }
});

module.exports = router;