const mongoose = require('mongoose');

const questionnaireResponseSchema = new mongoose.Schema({
  // User Identification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  leadId: {
    type: mongoose.Schema.Types.Mixed, // Allow both string and ObjectId
    index: true,
    sparse: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true,
    index: true
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    maxlength: 100
  },
  userPhone: {
    type: String,
    trim: true
  },
  userType: {
    type: String,
    enum: ['user', 'lead', 'guest'],
    default: 'lead',
    index: true
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'referral', 'social_media', 'lead_assessment', 'user_assessment'],
    default: 'lead_assessment'
  },
  
  // Assessment Questions - Structured Fields
  // Values & Lifestyle
  spiritualityImportance: {
    type: String,
    enum: ['Very important', 'Somewhat important', 'Not important']
  },
  premaritalCounseling: {
    type: String,
    enum: ["I'm open to it.", "I prefer not to.", "I'm not sure."]
  },
  sharedInterestsImportance: {
    type: String,
    enum: ['Very important', 'Somewhat important', 'Not important']
  },
  relocationOpenness: {
    type: String,
    enum: ["Yes, I'm fully open to relocating.", "Yes, but only within a specific region or country.", "No, I would prefer to stay in my current location."]
  },
  childrenPerspective: {
    type: String,
    enum: ["I definitely want children.", "I am open to it, but it's not a priority.", "I prefer not to have children.", "I'm still undecided."]
  },
  casteImportance: {
    type: String,
    enum: ['Yes, very much', 'Yes, somewhat', 'Not at all']
  },
  
  // Personal Preferences
  weekendPreferences: {
    type: [String],
    enum: ['Staying in and relaxing', 'Going out for drinks or dinner', 'Engaging in hobbies', 'Spending time with family', 'Exercising or being outdoors', 'Socializing with friends'],
    validate: {
      validator: function(arr) {
        return arr.length <= 3; // Max 3 selections
      },
      message: 'Please select up to 3 weekend preferences'
    }
  },
  familyIndependenceScenario: {
    type: String,
    enum: [
      'I would speak with both my parents and my partner to find a compromise, perhaps by living nearby or making a clear plan for how we can all be together.',
      'I would prioritize my parents\' wishes and explain to my partner that living with my family is a non-negotiable part of my life and values.',
      'I would stand by my partner and politely explain to my parents that we have decided to live independently after marriage.',
      'I would make it clear to both sides that we, as a couple, will make the decision that is best for our future, and we would not allow family pressure to influence it.'
    ]
  },
  hobbiesActivities: {
    type: [String],
    enum: ['Sports', 'Cooking', 'Reading', 'Listening to music', 'Traveling', 'Art or crafts', 'Trekking', 'Watching movies/shows']
  },
  drinkingHabits: {
    type: String,
    enum: ['Yes, socially', 'Yes, regularly', 'No']
  },
  smokingHabits: {
    type: String,
    enum: ['Yes', 'No', 'Sometimes']
  },
  relationshipReasons: {
    type: [String],
    enum: ['Emotional security', 'Having a partner I can trust', 'Someone to share my free time with', 'To build a family', 'Life is easier with a partner', 'To not be alone'],
    validate: {
      validator: function(arr) {
        return arr.length <= 3; // Max 3 selections
      },
      message: 'Please select up to 3 relationship reasons'
    }
  },
  careerOpportunityScenario: {
    type: String,
    enum: [
      'I would fully support them, no questions asked. Their dream is our dream, and we would figure out a way to make it work together.',
      'I\'d be supportive but would want to have a serious conversation about the practical details, like our jobs, finances, and how we\'d maintain the relationship long-distance.',
      'I would want to discuss whether this is the right time. I\'d need to feel confident that this big change won\'t negatively impact our relationship.',
      'I would be willing to put my own life on hold to move with them, because being together is what\'s most important to me.'
    ]
  },
  familyGatheringScenario: {
    type: String,
    enum: [
      'The Compromiser: "I would attend the family gathering for a few hours and then politely excuse ourselves to spend some private time together."',
      'The Dutiful Relative: "I would prioritize the family gathering, as it is an important obligation, and explain to my partner that we can have our private time later."',
      'The Partner-First Person: "I would politely decline the family invitation, explaining that we have other plans, and prioritize my partner and our time together."',
      'The Boundary Setter: "I would communicate to my family that while we love them, we need our personal time, and suggest another time for the gathering that works for everyone."'
    ]
  },
  
  // Legacy responses field for backward compatibility
  responses: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Responses are required'],
    default: {}
  },
  compatibilityProfile: {
    values: {
      type: [Number],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(val => val >= 0 && val <= 100);
        },
        message: 'Compatibility values must be between 0 and 100'
      }
    },
    lifestyle: {
      type: [Number],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(val => val >= 0 && val <= 100);
        },
        message: 'Lifestyle values must be between 0 and 100'
      }
    },
    interests: {
      type: [Number],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(val => val >= 0 && val <= 100);
        },
        message: 'Interest values must be between 0 and 100'
      }
    },
    personality: {
      type: [Number],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(val => val >= 0 && val <= 100);
        },
        message: 'Personality values must be between 0 and 100'
      }
    },
    communication: {
      type: [Number],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(val => val >= 0 && val <= 100);
        },
        message: 'Communication values must be between 0 and 100'
      }
    }
  },
  overallCompatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  questionnaire: {
    version: {
      type: String,
      default: '1.0'
    },
    type: {
      type: String,
      enum: ['basic', 'detailed', 'premium'],
      default: 'basic'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  completionTime: {
    type: Number, // in seconds
    min: 0,
    default: 0
  },
  completedAt: {
    type: Date
  },
  isComplete: {
    type: Boolean,
    default: false,
    index: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    sessionId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
questionnaireResponseSchema.index({ userId: 1 }, { sparse: true }); // Sparse index allows null values
questionnaireResponseSchema.index({ userEmail: 1 }, { sparse: true }); // Index for public submissions
questionnaireResponseSchema.index({ leadId: 1 }, { sparse: true }); // Index for lead submissions  
questionnaireResponseSchema.index({ createdAt: -1 });
questionnaireResponseSchema.index({ isComplete: 1, createdAt: -1 });
questionnaireResponseSchema.index({ 'questionnaire.type': 1 });
questionnaireResponseSchema.index({ userType: 1, createdAt: -1 });

// Virtual for response count
questionnaireResponseSchema.virtual('responseCount').get(function() {
  return Object.keys(this.responses || {}).length;
});

// Virtual for completion percentage
questionnaireResponseSchema.virtual('completionPercentage').get(function() {
  const totalQuestions = this.questionnaire.type === 'detailed' ? 50 : 
                        this.questionnaire.type === 'premium' ? 75 : 25;
  return Math.min((this.responseCount / totalQuestions) * 100, 100);
});

// Pre-save middleware to calculate compatibility scores
questionnaireResponseSchema.pre('save', function(next) {
  this.lastModified = new Date();
  
  // Calculate overall compatibility score
  const profiles = this.compatibilityProfile;
  const scores = [
    ...profiles.values,
    ...profiles.lifestyle,
    ...profiles.interests,
    ...profiles.personality,
    ...profiles.communication
  ];
  
  if (scores.length > 0) {
    this.overallCompatibilityScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  }
  
  // Check if questionnaire is complete
  this.isComplete = this.completionPercentage >= 80;
  
  next();
});

// Instance method to calculate compatibility with another user
questionnaireResponseSchema.methods.calculateCompatibilityWith = function(otherResponse) {
  if (!otherResponse || !otherResponse.compatibilityProfile) {
    return 0;
  }
  
  const myProfile = this.compatibilityProfile;
  const theirProfile = otherResponse.compatibilityProfile;
  
  const categories = ['values', 'lifestyle', 'interests', 'personality', 'communication'];
  let totalScore = 0;
  let weightSum = 0;
  
  // Weights for different categories
  const weights = {
    values: 0.3,
    lifestyle: 0.2,
    interests: 0.2,
    personality: 0.2,
    communication: 0.1
  };
  
  categories.forEach(category => {
    const myScores = myProfile[category] || [];
    const theirScores = theirProfile[category] || [];
    
    if (myScores.length > 0 && theirScores.length > 0) {
      // Calculate similarity score for this category
      const minLength = Math.min(myScores.length, theirScores.length);
      let categoryScore = 0;
      
      for (let i = 0; i < minLength; i++) {
        // Use inverse of absolute difference to get similarity
        const similarity = 100 - Math.abs(myScores[i] - theirScores[i]);
        categoryScore += similarity;
      }
      
      categoryScore = categoryScore / minLength;
      totalScore += categoryScore * weights[category];
      weightSum += weights[category];
    }
  });
  
  return weightSum > 0 ? Math.round(totalScore / weightSum) : 0;
};

// Static method to find compatible users
questionnaireResponseSchema.statics.findCompatibleUsers = function(userId, minCompatibility = 70, limit = 10) {
  return this.aggregate([
    {
      $match: {
        userId: { $ne: new mongoose.Types.ObjectId(userId) },
        isComplete: true
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              age: 1,
              location: 1,
              profilePicture: 1,
              isActive: 1
            }
          }
        ]
      }
    },
    {
      $match: {
        'user.isActive': true
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ['$user', 0] }
      }
    },
    {
      $sample: { size: limit * 2 } // Get more than needed to filter later
    },
    {
      $limit: limit
    }
  ]);
};

// Static method to get questionnaire analytics
questionnaireResponseSchema.statics.getAnalytics = function() {
  return this.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        completed: [
          { $match: { isComplete: true } },
          { $count: "count" }
        ],
        byType: [
          { $group: { _id: "$questionnaire.type", count: { $sum: 1 } } }
        ],
        avgCompletionTime: [
          { $match: { completionTime: { $gt: 0 } } },
          { $group: { _id: null, avgTime: { $avg: "$completionTime" } } }
        ],
        avgCompatibilityScore: [
          { $group: { _id: null, avgScore: { $avg: "$overallCompatibilityScore" } } }
        ]
      }
    }
  ]);
};

module.exports = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);
