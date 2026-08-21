const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    buyerName: {
      type: String,
      required: [true, 'Name is required'],
    },
    buyerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['buy', 'rent'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);