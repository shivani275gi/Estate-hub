const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, default: '' },
  city: { type: String, default: '' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  propertyType: { type: String, default: 'Apartment' },
  listingType: { type: String, default: 'Sale' },
  propertyAge: { type: String, default: 'New Construction' },
  ownershipType: { type: String, default: 'Freehold' },
  imageUrl: { type: String, default: '' },
  lat: { type: Number, default: 19.0760 },
  lng: { type: Number, default: 72.8777 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);