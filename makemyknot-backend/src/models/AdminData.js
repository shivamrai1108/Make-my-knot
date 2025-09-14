const mongoose = require('mongoose');

const adminDataSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  migratedFromLocalStorage: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
adminDataSchema.index({ key: 1 });
adminDataSchema.index({ migratedFromLocalStorage: 1 });

module.exports = mongoose.model('AdminData', adminDataSchema);
