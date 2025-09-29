const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  // Basic User Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    },
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Assessment Responses (14 questions)
  responses: {
    // Values & Lifestyle Questions
    spirituality_importance: {
      type: String,
      enum: ['Very important', 'Somewhat important', 'Not important']
    },
    premarital_counseling: {
      type: String,
      enum: ['I\'m open to it.', 'I prefer not to.', 'I\'m not sure.']
    },
    shared_interests_importance: {
      type: String,
      enum: ['Very important', 'Somewhat important', 'Not important']
    },
    relocation_openness: {
      type: String,
      enum: ['Yes, I\'m fully open to relocating.', 'Yes, but only within a specific region or country.', 'No, I would prefer to stay in my current location.']
    },
    children_perspective: {
      type: String,
      enum: ['I definitely want children.', 'I am open to it, but it\'s not a priority.', 'I prefer not to have children.', 'I\'m still undecided.']
    },
    caste_importance: {
      type: String,
      enum: ['Yes, very much', 'Yes, somewhat', 'Not at all']
    },
    
    // Personal Preferences Questions
    weekend_preferences: [{
      type: String,
      enum: ['Staying in and relaxing', 'Going out for drinks or dinner', 'Engaging in hobbies', 'Spending time with family', 'Exercising or being outdoors', 'Socializing with friends']
    }],
    family_independence_scenario: {
      type: String,
      enum: [
        'I would speak with both my parents and my partner to find a compromise, perhaps by living nearby or making a clear plan for how we can all be together.',
        'I would prioritize my parents\' wishes and explain to my partner that living with my family is a non-negotiable part of my life and values.',
        'I would stand by my partner and politely explain to my parents that we have decided to live independently after marriage.',
        'I would make it clear to both sides that we, as a couple, will make the decision that is best for our future, and we would not allow family pressure to influence it.'
      ]
    },
    hobbies_activities: [{
      type: String,
      enum: ['Sports', 'Cooking', 'Reading', 'Listening to music', 'Traveling', 'Art or crafts', 'Trekking', 'Watching movies/shows']
    }],
    drinking_habits: {
      type: String,
      enum: ['Yes, socially', 'Yes, regularly', 'No']
    },
    smoking_habits: {
      type: String,
      enum: ['Yes', 'No', 'Sometimes']
    },
    relationship_reasons: [{
      type: String,
      enum: ['Emotional security', 'Having a partner I can trust', 'Someone to share my free time with', 'To build a family', 'Life is easier with a partner', 'To not be alone']
    }],
    career_opportunity_scenario: {
      type: String,
      enum: [
        'I would fully support them, no questions asked. Their dream is our dream, and we would figure out a way to make it work together.',
        'I\'d be supportive but would want to have a serious conversation about the practical details, like our jobs, finances, and how we\'d maintain the relationship long-distance.',
        'I would want to discuss whether this is the right time. I\'d need to feel confident that this big change won\'t negatively impact our relationship.',
        'I would be willing to put my own life on hold to move with them, because being together is what\'s most important to me.'
      ]
    },
    family_gathering_scenario: {
      type: String,
      enum: [
        'The Compromiser: "I would attend the family gathering for a few hours and then politely excuse ourselves to spend some private time together."',
        'The Dutiful Relative: "I would prioritize the family gathering, as it is an important obligation, and explain to my partner that we can have our private time later."',
        'The Partner-First Person: "I would politely decline the family invitation, explaining that we have other plans, and prioritize my partner and our time together."',
        'The Boundary Setter: "I would communicate to my family that while we love them, we need our personal time, and suggest another time for the gathering that works for everyone."'
      ]
    }
  },
  
  // Assessment Metadata
  completionTime: {
    type: Number, // in minutes
    default: 0
  },
  isComplete: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['lead_assessment', 'user_assessment', 'direct_assessment'],
    default: 'direct_assessment'
  },
  
  // Reference IDs
  leadId: {
    type: String, // Reference to Lead if this assessment was done during lead flow
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User if this assessment was done by registered user
    default: null
  },
  
  // System metadata
  ipAddress: String,
  userAgent: String,
  submittedFrom: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
assessmentSchema.index({ email: 1 });
assessmentSchema.index({ createdAt: -1 });
assessmentSchema.index({ isComplete: 1, completedAt: -1 });
assessmentSchema.index({ leadId: 1 });
assessmentSchema.index({ userId: 1 });

// Virtual for response completion percentage
assessmentSchema.virtual('completionPercentage').get(function() {
  const totalQuestions = 14;
  let answeredQuestions = 0;
  
  // Count answered questions
  if (this.responses) {
    const responses = this.responses;
    if (responses.spirituality_importance) answeredQuestions++;
    if (responses.premarital_counseling) answeredQuestions++;
    if (responses.shared_interests_importance) answeredQuestions++;
    if (responses.relocation_openness) answeredQuestions++;
    if (responses.children_perspective) answeredQuestions++;
    if (responses.caste_importance) answeredQuestions++;
    if (responses.weekend_preferences && responses.weekend_preferences.length > 0) answeredQuestions++;
    if (responses.family_independence_scenario) answeredQuestions++;
    if (responses.hobbies_activities && responses.hobbies_activities.length > 0) answeredQuestions++;
    if (responses.drinking_habits) answeredQuestions++;
    if (responses.smoking_habits) answeredQuestions++;
    if (responses.relationship_reasons && responses.relationship_reasons.length > 0) answeredQuestions++;
    if (responses.career_opportunity_scenario) answeredQuestions++;
    if (responses.family_gathering_scenario) answeredQuestions++;
  }
  
  return Math.round((answeredQuestions / totalQuestions) * 100);
});

// Instance method to get compatibility score with another assessment
assessmentSchema.methods.calculateCompatibilityWith = function(otherAssessment) {
  // Basic compatibility scoring algorithm
  let score = 0;
  let totalComparisons = 0;
  
  const myResponses = this.responses;
  const otherResponses = otherAssessment.responses;
  
  // Values alignment (higher weight)
  const valueQuestions = [
    'spirituality_importance',
    'shared_interests_importance', 
    'children_perspective',
    'caste_importance'
  ];
  
  valueQuestions.forEach(question => {
    if (myResponses[question] && otherResponses[question]) {
      totalComparisons += 3; // Higher weight for values
      if (myResponses[question] === otherResponses[question]) {
        score += 3;
      }
    }
  });
  
  // Lifestyle alignment (medium weight)
  const lifestyleQuestions = [
    'drinking_habits',
    'smoking_habits',
    'relocation_openness'
  ];
  
  lifestyleQuestions.forEach(question => {
    if (myResponses[question] && otherResponses[question]) {
      totalComparisons += 2; // Medium weight for lifestyle
      if (myResponses[question] === otherResponses[question]) {
        score += 2;
      }
    }
  });
  
  // Personal preferences (lower weight)
  const personalQuestions = [
    'premarital_counseling',
    'family_independence_scenario',
    'career_opportunity_scenario',
    'family_gathering_scenario'
  ];
  
  personalQuestions.forEach(question => {
    if (myResponses[question] && otherResponses[question]) {
      totalComparisons += 1; // Lower weight for personal preferences
      if (myResponses[question] === otherResponses[question]) {
        score += 1;
      }
    }
  });
  
  // Array fields (interests and activities) - partial matching
  if (myResponses.weekend_preferences && otherResponses.weekend_preferences) {
    totalComparisons += 2;
    const commonPreferences = myResponses.weekend_preferences.filter(pref => 
      otherResponses.weekend_preferences.includes(pref)
    );
    const matchRatio = commonPreferences.length / Math.max(myResponses.weekend_preferences.length, otherResponses.weekend_preferences.length);
    score += 2 * matchRatio;
  }
  
  if (myResponses.hobbies_activities && otherResponses.hobbies_activities) {
    totalComparisons += 2;
    const commonHobbies = myResponses.hobbies_activities.filter(hobby => 
      otherResponses.hobbies_activities.includes(hobby)
    );
    const matchRatio = commonHobbies.length / Math.max(myResponses.hobbies_activities.length, otherResponses.hobbies_activities.length);
    score += 2 * matchRatio;
  }
  
  return totalComparisons > 0 ? Math.round((score / totalComparisons) * 100) : 0;
};

// Static method to find compatible assessments
assessmentSchema.statics.findCompatibleAssessments = function(userEmail, minCompatibility = 70, limit = 10) {
  // This would be implemented to find compatible users based on their assessment responses
  return this.find({ 
    email: { $ne: userEmail },
    isComplete: true 
  }).limit(limit);
};

// Static method to get assessment analytics
assessmentSchema.statics.getAnalytics = function(dateRange = 30) {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        completed: [
          { $match: { isComplete: true } },
          { $count: "count" }
        ],
        recent: [
          { $match: { createdAt: { $gte: startDate } } },
          { $count: "count" }
        ],
        bySource: [
          { $group: { _id: "$source", count: { $sum: 1 } } }
        ],
        avgCompletionTime: [
          { $match: { isComplete: true, completionTime: { $gt: 0 } } },
          { $group: { _id: null, avgTime: { $avg: "$completionTime" } } }
        ]
      }
    }
  ]);
};

module.exports = mongoose.model('Assessment', assessmentSchema);