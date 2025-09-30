const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(date) {
        const age = Math.floor((Date.now() - date) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 18 && age <= 100;
      },
      message: 'You must be between 18 and 100 years old'
    }
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(phone) {
        return !phone || validator.isMobilePhone(phone);
      },
      message: 'Please provide a valid phone number'
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  profilePictures: [{
    url: String,
    isMain: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    city: String,
    state: String,
    country: String
  },
  preferences: {
    ageRange: {
      min: {
        type: Number,
        default: 18,
        min: 18,
        max: 100
      },
      max: {
        type: Number,
        default: 35,
        min: 18,
        max: 100
      }
    },
    maxDistance: {
      type: Number,
      default: 50, // kilometers
      min: 1,
      max: 500
    },
    lookingFor: {
      type: String,
      enum: ['serious', 'casual', 'friendship', 'not-sure'],
      default: 'not-sure'
    },
    interests: [{
      type: String,
      trim: true
    }],
    education: {
      type: String,
      enum: ['high-school', 'some-college', 'bachelors', 'masters', 'phd', 'other']
    },
    occupation: String,
    lifestyle: {
      smoking: {
        type: String,
        enum: ['never', 'socially', 'regularly', 'prefer-not-to-say']
      },
      drinking: {
        type: String,
        enum: ['never', 'socially', 'regularly', 'prefer-not-to-say']
      },
      exercise: {
        type: String,
        enum: ['never', 'sometimes', 'regularly', 'very-active']
      }
    }
  },
  verification: {
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    phoneVerificationCode: String,
    phoneVerificationExpires: Date,
    isProfileVerified: {
      type: Boolean,
      default: false
    }
  },
  resetPassword: {
    token: String,
    expires: Date
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  socialLogins: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  },
  matches: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    matchedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'unmatched'],
      default: 'active'
    }
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  passes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    passedAt: {
      type: Date,
      default: Date.now
    }
  }],
  blocked: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    blockedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  reported: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'gold'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    notifications: {
      newMatches: {
        type: Boolean,
        default: true
      },
      newMessages: {
        type: Boolean,
        default: true
      },
      likes: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      showOnlineStatus: {
        type: Boolean,
        default: true
      },
      showDistance: {
        type: Boolean,
        default: true
      },
      showAge: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  suspendedUntil: Date,
  suspensionReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'dateOfBirth': 1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ 'verification.isEmailVerified': 1 });

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  return Math.floor((Date.now() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Instance method to check if user is within distance
userSchema.methods.isWithinDistance = function(otherUser, maxDistance = 50) {
  if (!this.location.coordinates || !otherUser.location.coordinates) {
    return false;
  }

  const [lng1, lat1] = this.location.coordinates;
  const [lng2, lat2] = otherUser.location.coordinates;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= maxDistance;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPassword.token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPassword.expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.verification.emailVerificationToken = verificationToken;
  this.verification.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Static method to find potential matches
userSchema.statics.findPotentialMatches = function(userId, userPreferences, userLocation) {
  return this.aggregate([
    {
      $match: {
        _id: { $ne: userId },
        isActive: true,
        'verification.isEmailVerified': true,
        // Exclude users already liked, passed, or blocked
        _id: {
          $nin: [
            ...userPreferences.likes?.map(l => l.user) || [],
            ...userPreferences.passes?.map(p => p.user) || [],
            ...userPreferences.blocked?.map(b => b.user) || []
          ]
        }
      }
    },
    {
      $addFields: {
        age: {
          $floor: {
            $divide: [
              { $subtract: [new Date(), '$dateOfBirth'] },
              365.25 * 24 * 60 * 60 * 1000
            ]
          }
        }
      }
    },
    {
      $match: {
        age: {
          $gte: userPreferences.ageRange?.min || 18,
          $lte: userPreferences.ageRange?.max || 100
        }
      }
    },
    // Add geospatial distance calculation if location is provided
    ...(userLocation ? [{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: userLocation.coordinates
        },
        distanceField: 'distance',
        maxDistance: (userPreferences.maxDistance || 50) * 1000, // Convert to meters
        spherical: true
      }
    }] : []),
    {
      $sample: { size: 20 } // Limit to 20 potential matches
    }
  ]);
};

module.exports = mongoose.model('User', userSchema);
