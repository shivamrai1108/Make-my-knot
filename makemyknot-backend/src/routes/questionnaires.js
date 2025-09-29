const express = require('express');
const QuestionnaireResponse = require('../models/QuestionnaireResponse');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes (no auth required) for lead questionnaires
// POST /api/questionnaires/public - Create questionnaire response from lead (PUBLIC ACCESS)
router.post('/public', catchAsync(async (req, res) => {
  // Add CORS headers for public access
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const { 
    userEmail,
    userName,
    userPhone,
    leadId,
    responses, 
    userType = 'lead',
    source = 'website',
    completionTime = 0,
    metadata = {}
  } = req.body;
  
  if (!userEmail || !responses) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and responses are required'
    });
  }
  
  // Check if questionnaire already exists for this email
  let questionnaireResponse = await QuestionnaireResponse.findOne({ userEmail });
  
  if (questionnaireResponse) {
    // Update existing response
    questionnaireResponse.responses = { ...questionnaireResponse.responses, ...responses };
    questionnaireResponse.userName = userName || questionnaireResponse.userName;
    questionnaireResponse.userPhone = userPhone || questionnaireResponse.userPhone;
    questionnaireResponse.leadId = leadId || questionnaireResponse.leadId;
    questionnaireResponse.completionTime = completionTime;
    questionnaireResponse.isComplete = true;
    questionnaireResponse.completedAt = new Date();
    
    await questionnaireResponse.save();
  } else {
    // Create new response
    questionnaireResponse = await QuestionnaireResponse.create({
      userEmail,
      userName,
      userPhone,
      leadId,
      userType,
      source,
      responses,
      isComplete: true,
      completedAt: new Date(),
      completionTime,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        submittedAt: new Date(),
        ...metadata
      }
    });
  }
  
  res.status(201).json({
    status: 'success',
    message: 'Questionnaire submitted successfully',
    data: {
      response: {
        id: questionnaireResponse._id,
        userEmail: questionnaireResponse.userEmail,
        userName: questionnaireResponse.userName,
        isComplete: questionnaireResponse.isComplete,
        completedAt: questionnaireResponse.completedAt
      }
    }
  });
}));

// GET /api/questionnaires/public/:email - Get questionnaire by email (PUBLIC ACCESS)
router.get('/public/:email', catchAsync(async (req, res) => {
  const response = await QuestionnaireResponse.findOne({ 
    userEmail: req.params.email 
  }).select('-metadata -__v');
  
  if (!response) {
    return res.status(404).json({
      status: 'error',
      message: 'Questionnaire not found'
    });
  }
  
  res.json({
    status: 'success',
    data: {
      response: {
        id: response._id,
        userEmail: response.userEmail,
        userName: response.userName,
        isComplete: response.isComplete,
        completedAt: response.completedAt,
        responses: response.responses
      }
    }
  });
}));

// Protected routes require authentication
router.use(protect);

// GET /api/questionnaires/me - Get current user's questionnaire response
router.get('/me', catchAsync(async (req, res) => {
  const response = await QuestionnaireResponse.findOne({ userId: req.user.id })
    .populate('userId', 'firstName lastName email age');
  
  res.json({
    status: 'success',
    data: {
      response
    }
  });
}));

// POST /api/questionnaires - Create or update questionnaire response
router.post('/', catchAsync(async (req, res) => {
  const { 
    responses, 
    compatibilityProfile, 
    questionnaire = {},
    completionTime = 0,
    metadata = {}
  } = req.body;
  
  // Check if user already has a response
  let questionnaireResponse = await QuestionnaireResponse.findOne({ userId: req.user.id });
  
  if (questionnaireResponse) {
    // Update existing response
    questionnaireResponse.responses = { ...questionnaireResponse.responses, ...responses };
    questionnaireResponse.compatibilityProfile = { 
      ...questionnaireResponse.compatibilityProfile, 
      ...compatibilityProfile 
    };
    questionnaireResponse.questionnaire = { ...questionnaireResponse.questionnaire, ...questionnaire };
    questionnaireResponse.completionTime = completionTime || questionnaireResponse.completionTime;
    questionnaireResponse.metadata = { ...questionnaireResponse.metadata, ...metadata };
    
    await questionnaireResponse.save();
  } else {
    // Create new response
    questionnaireResponse = await QuestionnaireResponse.create({
      userId: req.user.id,
      responses,
      compatibilityProfile,
      questionnaire: {
        version: '1.0',
        type: 'basic',
        language: 'en',
        ...questionnaire
      },
      completionTime,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        ...metadata
      }
    });
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      response: questionnaireResponse
    }
  });
}));

// PATCH /api/questionnaires/me - Update specific parts of questionnaire
router.patch('/me', catchAsync(async (req, res, next) => {
  const questionnaireResponse = await QuestionnaireResponse.findOne({ userId: req.user.id });
  
  if (!questionnaireResponse) {
    return next(new AppError('Questionnaire response not found', 404));
  }
  
  const { responses, compatibilityProfile, completionTime } = req.body;
  
  if (responses) {
    questionnaireResponse.responses = { ...questionnaireResponse.responses, ...responses };
  }
  
  if (compatibilityProfile) {
    questionnaireResponse.compatibilityProfile = { 
      ...questionnaireResponse.compatibilityProfile, 
      ...compatibilityProfile 
    };
  }
  
  if (completionTime !== undefined) {
    questionnaireResponse.completionTime = completionTime;
  }
  
  await questionnaireResponse.save();
  
  res.json({
    status: 'success',
    data: {
      response: questionnaireResponse
    }
  });
}));

// GET /api/questionnaires/compatibility/:userId - Calculate compatibility with another user
router.get('/compatibility/:userId', catchAsync(async (req, res, next) => {
  const myResponse = await QuestionnaireResponse.findOne({ userId: req.user.id });
  const otherResponse = await QuestionnaireResponse.findOne({ userId: req.params.userId })
    .populate('userId', 'firstName lastName age profilePicture');
  
  if (!myResponse) {
    return next(new AppError('You need to complete the questionnaire first', 400));
  }
  
  if (!otherResponse) {
    return next(new AppError('Other user has not completed the questionnaire', 404));
  }
  
  const compatibilityScore = myResponse.calculateCompatibilityWith(otherResponse);
  
  res.json({
    status: 'success',
    data: {
      compatibilityScore,
      user: otherResponse.userId,
      calculatedAt: new Date().toISOString()
    }
  });
}));

// GET /api/questionnaires/matches - Find compatible users
router.get('/matches', catchAsync(async (req, res, next) => {
  const { minCompatibility = 70, limit = 10 } = req.query;
  
  const myResponse = await QuestionnaireResponse.findOne({ userId: req.user.id });
  
  if (!myResponse) {
    return next(new AppError('You need to complete the questionnaire first', 400));
  }
  
  const compatibleUsers = await QuestionnaireResponse.findCompatibleUsers(
    req.user.id,
    parseInt(minCompatibility),
    parseInt(limit)
  );
  
  // Calculate compatibility scores for each user
  const matches = compatibleUsers.map(userResponse => {
    const compatibilityScore = myResponse.calculateCompatibilityWith(userResponse);
    return {
      user: userResponse.user,
      compatibilityScore,
      questionnaire: userResponse.questionnaire,
      completedAt: userResponse.createdAt
    };
  }).filter(match => match.compatibilityScore >= parseInt(minCompatibility))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  res.json({
    status: 'success',
    results: matches.length,
    data: {
      matches
    }
  });
}));

// GET /api/questionnaires/analytics - Get questionnaire analytics (admin only)
router.get('/analytics', catchAsync(async (req, res) => {
  const analytics = await QuestionnaireResponse.getAnalytics();
  
  res.json({
    status: 'success',
    data: {
      analytics: analytics[0] // aggregate returns array with one result
    }
  });
}));

// GET /api/questionnaires - Get all responses with filters (admin only)
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    isComplete, 
    type,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  // Build filter object
  const filter = {};
  if (isComplete !== undefined) filter.isComplete = isComplete === 'true';
  if (type) filter['questionnaire.type'] = type;
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const responses = await QuestionnaireResponse.find(filter)
    .populate('userId', 'firstName lastName email age')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
  const total = await QuestionnaireResponse.countDocuments(filter);
  
  res.json({
    status: 'success',
    results: responses.length,
    data: {
      responses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// GET /api/questionnaires/:id - Get specific questionnaire response (admin only)
router.get('/:id', catchAsync(async (req, res, next) => {
  const response = await QuestionnaireResponse.findById(req.params.id)
    .populate('userId', 'firstName lastName email age profilePicture');
  
  if (!response) {
    return next(new AppError('Questionnaire response not found', 404));
  }
  
  res.json({
    status: 'success',
    data: {
      response
    }
  });
}));

// DELETE /api/questionnaires/me - Delete current user's questionnaire response
router.delete('/me', catchAsync(async (req, res, next) => {
  const response = await QuestionnaireResponse.findOneAndDelete({ userId: req.user.id });
  
  if (!response) {
    return next(new AppError('Questionnaire response not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

module.exports = router;
