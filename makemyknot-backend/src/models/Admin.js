const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  // Basic Authentication Info
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
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
    select: false
  },
  
  // Personal Information
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
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'support'],
    default: 'admin',
    required: true
  },
  permissions: [{
    type: String,
    enum: [
      'users:read', 'users:write', 'users:delete',
      'leads:read', 'leads:write', 'leads:delete',
      'notifications:read', 'notifications:write', 'notifications:delete',
      'questionnaires:read', 'questionnaires:write', 'questionnaires:delete',
      'assessments:read', 'assessments:write', 'assessments:delete',
      'webinars:read', 'webinars:write', 'webinars:delete',
      'offers:read', 'offers:write', 'offers:delete',
      'analytics:read', 'analytics:advanced',
      'system:configure', 'system:backup', 'system:maintenance',
      'crm:configure', 'crm:sync',
      'billing:read', 'billing:write',
      'moderation:content', 'moderation:users'
    ]
  }],
  
  // Admin Settings and Preferences
  settings: {
    dashboard: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
      },
      defaultTab: {
        type: String,
        enum: ['dashboard', 'users', 'leads', 'nominations', 'questionnaires', 'assessments', 'webinars', 'offers', 'matchmaking', 'moderation', 'payments', 'analytics', 'communication'],
        default: 'dashboard'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        browser: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        }
      }
    },
    crm: {
      provider: {
        type: String,
        enum: ['hubspot', 'salesforce', 'pipedrive', 'custom', 'none'],
        default: 'none'
      },
      apiKey: {
        type: String,
        select: false // Keep API keys secure
      },
      baseUrl: String,
      isEnabled: {
        type: Boolean,
        default: false
      },
      syncFrequency: {
        type: Number,
        default: 60, // minutes
        min: 15,
        max: 1440
      },
      autoSync: {
        type: Boolean,
        default: false
      },
      fieldMappings: {
        type: Map,
        of: String,
        default: new Map([
          ['name', 'firstname'],
          ['email', 'email'],
          ['phone', 'phone'],
          ['status', 'lifecyclestage']
        ])
      }
    },
    system: {
      maintenanceMode: {
        type: Boolean,
        default: false
      },
      debugMode: {
        type: Boolean,
        default: false
      },
      logLevel: {
        type: String,
        enum: ['error', 'warn', 'info', 'debug'],
        default: 'info'
      }
    }
  },
  
  // Activity Tracking
  lastLogin: Date,
  lastActivity: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0,
    max: 5
  },
  lockUntil: Date,
  
  // Session Management
  sessions: [{
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Security
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: {
      type: String,
      select: false
    },
    backupCodes: [{
      type: String,
      select: false
    }]
  },
  
  // Password Reset
  resetPassword: {
    token: String,
    expires: Date
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  suspendedUntil: Date,
  suspensionReason: String,
  
  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive data from JSON output
      delete ret.password;
      delete ret.sessions;
      delete ret.twoFactorAuth;
      delete ret.resetPassword;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1, isActive: 1 });
adminSchema.index({ lastActivity: -1 });
adminSchema.index({ 'sessions.sessionId': 1 });

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for checking if account is locked
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to update lastActivity
adminSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Instance method to check password
adminSchema.methods.correctPassword = async function(candidatePassword, adminPassword) {
  return await bcrypt.compare(candidatePassword, adminPassword);
};

// Instance method to increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Instance method to check permissions
adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

// Instance method to add session
adminSchema.methods.addSession = function(sessionData) {
  this.sessions.push({
    sessionId: sessionData.sessionId,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent
  });
  
  // Keep only last 10 sessions
  if (this.sessions.length > 10) {
    this.sessions = this.sessions.slice(-10);
  }
  
  return this.save();
};

// Instance method to remove session
adminSchema.methods.removeSession = function(sessionId) {
  this.sessions = this.sessions.filter(s => s.sessionId !== sessionId);
  return this.save();
};

// Instance method to update activity
adminSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to get default permissions by role
adminSchema.statics.getDefaultPermissions = function(role) {
  const permissions = {
    super_admin: [
      'users:read', 'users:write', 'users:delete',
      'leads:read', 'leads:write', 'leads:delete',
      'notifications:read', 'notifications:write', 'notifications:delete',
      'questionnaires:read', 'questionnaires:write', 'questionnaires:delete',
      'assessments:read', 'assessments:write', 'assessments:delete',
      'webinars:read', 'webinars:write', 'webinars:delete',
      'offers:read', 'offers:write', 'offers:delete',
      'analytics:read', 'analytics:advanced',
      'system:configure', 'system:backup', 'system:maintenance',
      'crm:configure', 'crm:sync',
      'billing:read', 'billing:write',
      'moderation:content', 'moderation:users'
    ],
    admin: [
      'users:read', 'users:write',
      'leads:read', 'leads:write',
      'notifications:read', 'notifications:write',
      'questionnaires:read', 'questionnaires:write',
      'assessments:read', 'assessments:write',
      'webinars:read', 'webinars:write',
      'offers:read', 'offers:write',
      'analytics:read',
      'crm:sync',
      'billing:read',
      'moderation:content'
    ],
    moderator: [
      'users:read',
      'leads:read', 'leads:write',
      'notifications:read', 'notifications:write',
      'questionnaires:read',
      'assessments:read',
      'analytics:read',
      'moderation:content', 'moderation:users'
    ],
    support: [
      'users:read',
      'leads:read',
      'notifications:read', 'notifications:write',
      'questionnaires:read',
      'assessments:read'
    ]
  };
  
  return permissions[role] || [];
};

// Static method to create default super admin
adminSchema.statics.createSuperAdmin = async function(adminData) {
  const existingSuperAdmin = await this.findOne({ role: 'super_admin' });
  if (existingSuperAdmin) {
    throw new Error('Super admin already exists');
  }
  
  const superAdmin = new this({
    ...adminData,
    role: 'super_admin',
    permissions: this.getDefaultPermissions('super_admin'),
    isVerified: true,
    isActive: true
  });
  
  return await superAdmin.save();
};

module.exports = mongoose.model('Admin', adminSchema);