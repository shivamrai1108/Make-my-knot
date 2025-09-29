const mongoose = require('mongoose');
const validator = require('validator');

const leadSchema = new mongoose.Schema({
  // Basic Contact Information
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    index: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(phone) {
        return validator.isMobilePhone(phone);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: false, // Optional for leads, required for user conversion
    minlength: [8, 'Password must be at least 8 characters long']
  },
  dateOfBirth: {
    type: Date,
    required: false,
    validate: {
      validator: function(date) {
        if (!date) return true; // Optional field
        const age = (new Date() - date) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 18; // Must be at least 18 years old
      },
      message: 'Must be at least 18 years old'
    }
  },
  countryCode: {
    type: String,
    default: '+91',
    trim: true
  },
  
  // Lead Questionnaire Specific Fields
  matchmakingExperience: {
    type: String,
    enum: ['Yes', 'No'],
    required: false
  },
  genderIdentity: {
    type: String,
    enum: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'],
    required: false
  },
  openToMeeting: {
    type: String,
    enum: ['Men', 'Women', 'Non-binary', 'All genders'],
    required: false
  },
  preferredAgeRange: {
    type: String,
    trim: true,
    validate: {
      validator: function(range) {
        if (!range) return true; // Optional field
        return /^\d{2}-\d{2}$/.test(range); // Format: "25-35"
      },
      message: 'Age range must be in format "25-35"'
    }
  },
  currentLocation: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Additional Profile Information
  hasBiodata: {
    type: Boolean,
    default: false
  },
  biodataFileName: {
    type: String,
    trim: true
  },
  
  // Legacy answers field for backward compatibility
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['new', 'verified', 'deleted', 'contacted'],
    default: 'new',
    index: true
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'referral', 'advertisement'],
    default: 'website'
  },
  leadScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    message: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  followUpDate: Date,
  syncedAt: Date,
  crmId: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
leadSchema.index({ email: 1, status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ followUpDate: 1 });

// Virtual for lead age (days since creation)
leadSchema.virtual('leadAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (24 * 60 * 60 * 1000));
});

// Instance method to calculate lead score
leadSchema.methods.calculateLeadScore = function() {
  let score = 0;
  
  // Basic info completeness (40 points)
  if (this.name && this.email && this.phone) score += 40;
  
  // Answer completeness (30 points)
  const answerCount = Object.keys(this.answers || {}).length;
  score += Math.min(answerCount * 5, 30);
  
  // Recency bonus (30 points)
  const daysSinceCreated = this.leadAge;
  if (daysSinceCreated === 0) score += 30;
  else if (daysSinceCreated <= 1) score += 20;
  else if (daysSinceCreated <= 3) score += 10;
  else if (daysSinceCreated <= 7) score += 5;
  
  this.leadScore = Math.min(score, 100);
  return this.leadScore;
};

// Static method to get leads analytics
leadSchema.statics.getAnalytics = function(dateRange = 30) {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        recent: [
          { $match: { createdAt: { $gte: startDate } } },
          { $count: "count" }
        ],
        bySource: [
          { $group: { _id: "$source", count: { $sum: 1 } } }
        ],
        avgScore: [
          { $group: { _id: null, avgScore: { $avg: "$leadScore" } } }
        ]
      }
    }
  ]);
};

module.exports = mongoose.model('Lead', leadSchema);
