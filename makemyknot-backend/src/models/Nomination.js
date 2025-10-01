const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema({
  // Nominator Information
  nominatorName: {
    type: String,
    required: [true, 'Nominator name is required'],
    trim: true,
    maxlength: 100
  },
  nominatorEmail: {
    type: String,
    required: [true, 'Nominator email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid nominator email address'
    }
  },
  nominatorPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Nominee Information
  nomineeName: {
    type: String,
    required: [true, 'Nominee name is required'],
    trim: true,
    maxlength: 100
  },
  nomineeEmail: {
    type: String,
    required: [true, 'Nominee email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid nominee email address'
    }
  },
  nomineePhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Relationship and Details
  relationship: {
    type: String,
    required: [true, 'Relationship is required'],
    enum: ['friend', 'colleague', 'family', 'acquaintance', 'other']
  },
  reason: {
    type: String,
    required: [true, 'Reason for nomination is required'],
    trim: true,
    maxlength: 1000
  },
  nomineeKnows: {
    type: Boolean,
    default: false
  },
  
  // Status and Processing
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'joined', 'declined', 'follow_up', 'closed'],
    default: 'new'
  },
  contacted: {
    type: Boolean,
    default: false
  },
  contactedAt: {
    type: Date
  },
  joinedAsUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Admin Notes and Management
  adminNotes: {
    type: String,
    maxlength: 2000
  },
  assignedTo: {
    type: String, // Admin user handling this nomination
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // System fields
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
nominationSchema.index({ nomineeEmail: 1 });
nominationSchema.index({ nominatorEmail: 1 });
nominationSchema.index({ status: 1, createdAt: -1 });
nominationSchema.index({ contacted: 1, createdAt: -1 });
nominationSchema.index({ assignedTo: 1 });

// Virtual for days since submission
nominationSchema.virtual('daysSinceSubmission').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Method to check if follow-up is needed
nominationSchema.methods.needsFollowUp = function() {
  if (this.contacted && this.status === 'contacted') {
    const daysSinceContact = Math.floor((Date.now() - this.contactedAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceContact >= 7; // Follow up after 7 days
  }
  return this.daysSinceSubmission >= 3 && !this.contacted; // Contact within 3 days
};

// Static method to get nominations needing attention
nominationSchema.statics.getNominationsNeedingAttention = function() {
  return this.find({
    $or: [
      { status: 'new', createdAt: { $lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } }, // 3+ days old
      { status: 'contacted', contactedAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // 7+ days since contact
      { status: 'follow_up' }
    ]
  }).sort({ createdAt: -1 });
};

// Static method for analytics
nominationSchema.statics.getAnalytics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalNominations: { $sum: 1 },
        newNominations: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        contactedNominations: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
        joinedNominations: { $sum: { $cond: [{ $eq: ['$status', 'joined'] }, 1, 0] } },
        thisWeekNominations: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        },
        thisMonthNominations: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Nomination', nominationSchema);