const Property = require('../models/Property');

// 1. CREATE NEW PROPERTY
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      propertyType,
      purpose,
      price,
      monthlyRent,
      securityDeposit,
      maintenanceCharges,
      furnishingStatus,
      preferredTenants,
      availabilityDate,
      propertyAge,
      ownershipType,
      imageUrl,
    } = req.body;

    const property = new Property({
      title,
      description,
      location,
      propertyType,
      purpose,
      price,
      monthlyRent,
      securityDeposit,
      maintenanceCharges,
      furnishingStatus,
      preferredTenants,
      availabilityDate,
      propertyAge,
      ownershipType,
      imageUrl,
      owner: req.user.userId, // Authenticated user ID
    });

    await property.save();

    res.status(201).json({
      message: 'Property created successfully!',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. GET ALL PROPERTIES
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. GET SINGLE PROPERTY BY ID (With Owner Populate)
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'username email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};