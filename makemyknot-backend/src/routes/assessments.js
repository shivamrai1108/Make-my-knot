const express = require('express');
const Assessment = require('../models/Assessment');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes (no auth required) for assessment submissions
// POST /api/assessments/public - Create assessment response from lead or user (PUBLIC ACCESS)
router.post('/public', catchAsync(async (req, res) => {
  // Add CORS headers for public access
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const { 
    name,
    email,
    phone,
    responses, 
    leadId,
    userId,
    completionTime = 0,
    source = 'direct_assessment'
  } = req.body;
  
  if (!name || !email || !phone || !responses) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email, phone, and responses are required'
    });
  }
  
  // Map the questionnaire responses to our structured format
  const structuredResponses = {
    spirituality_importance: responses.spirituality_importance,
    premarital_counseling: responses.premarital_counseling,
    shared_interests_importance: responses.shared_interests_importance,
    relocation_openness: responses.relocation_openness,
    children_perspective: responses.children_perspective,
    caste_importance: responses.caste_importance,
    weekend_preferences: Array.isArray(responses.weekend_preferences) ? responses.weekend_preferences : [],
    family_independence_scenario: responses.family_independence_scenario,
    hobbies_activities: Array.isArray(responses.hobbies_activities) ? responses.hobbies_activities : [],
    drinking_habits: responses.drinking_habits,
    smoking_habits: responses.smoking_habits,
    relationship_reasons: Array.isArray(responses.relationship_reasons) ? responses.relationship_reasons : [],
    career_opportunity_scenario: responses.career_opportunity_scenario,
    family_gathering_scenario: responses.family_gathering_scenario
  };
  
  const assessmentData = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    responses: structuredResponses,
    completionTime,
    source,
    leadId: leadId || null,
    userId: userId || null,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    submittedFrom: 'website'
  };
  
  // Check if assessment already exists for this email
  let assessment = await Assessment.findOne({ email: assessmentData.email });
  
  if (assessment) {
    // Update existing assessment
    Object.assign(assessment, assessmentData);
    assessment.responses = { ...assessment.responses, ...structuredResponses };
    assessment.isComplete = true;
    assessment.completedAt = new Date();
    
    await assessment.save();
    console.log('✅ Updated existing assessment for:', assessmentData.email);
  } else {
    // Create new assessment
    assessmentData.isComplete = true;
    assessmentData.completedAt = new Date();
    
    assessment = await Assessment.create(assessmentData);
    console.log('✅ Created new assessment for:', assessmentData.email);
  }
  
  res.status(201).json({
    status: 'success',
    message: 'Assessment submitted successfully',
    data: {
      assessment: {
        id: assessment._id,
        name: assessment.name,
        email: assessment.email,
        phone: assessment.phone,
        isComplete: assessment.isComplete,
        completedAt: assessment.completedAt,
        completionPercentage: assessment.completionPercentage,
        source: assessment.source
      }
    }
  });
}));

// GET /api/assessments/public/:email - Get assessment by email (PUBLIC ACCESS)
router.get('/public/:email', catchAsync(async (req, res) => {
  const assessment = await Assessment.findOne({ 
    email: req.params.email.toLowerCase() 
  }).select('-__v');
  
  if (!assessment) {
    return res.status(404).json({
      status: 'error',
      message: 'Assessment not found'
    });
  }
  
  res.json({
    status: 'success',
    data: {
      assessment: {
        id: assessment._id,
        name: assessment.name,
        email: assessment.email,
        phone: assessment.phone,
        isComplete: assessment.isComplete,
        completedAt: assessment.completedAt,
        completionPercentage: assessment.completionPercentage,
        responses: assessment.responses,
        source: assessment.source
      }
    }
  });
}));

// GET /api/assessments/admin - Get all assessments for admin (PUBLIC for now)
router.get('/admin', catchAsync(async (req, res) => {
  const assessments = await Assessment.find({})
    .sort({ createdAt: -1 })
    .limit(100) // Limit to recent 100 assessments
    .select('-__v');
  
  // Transform data for admin view
  const transformedAssessments = assessments.map(assessment => ({
    id: assessment._id,
    name: assessment.name,
    email: assessment.email,
    phone: assessment.phone,
    isComplete: assessment.isComplete,
    completedAt: assessment.completedAt,
    completionPercentage: assessment.completionPercentage,
    completionTime: assessment.completionTime,
    source: assessment.source,
    leadId: assessment.leadId,
    userId: assessment.userId,
    createdAt: assessment.createdAt,
    responses: assessment.responses
  }));
  
  res.json({
    status: 'success',
    results: transformedAssessments.length,
    data: {
      assessments: transformedAssessments
    }
  });
}));

// GET /api/assessments/analytics - Get assessment analytics (PUBLIC for now)
router.get('/analytics', catchAsync(async (req, res) => {
  const analytics = await Assessment.getAnalytics();
  
  res.json({
    status: 'success',
    data: {
      analytics: analytics[0] // aggregate returns array with one result
    }
  });
}));

// Protected routes require authentication
router.use(protect);

// GET /api/assessments/me - Get current user's assessment
router.get('/me', catchAsync(async (req, res) => {
  const assessment = await Assessment.findOne({ userId: req.user.id });
  
  res.json({
    status: 'success',
    data: {
      assessment
    }
  });
}));

// POST /api/assessments - Create or update assessment for authenticated user
router.post('/', catchAsync(async (req, res) => {
  const { responses, completionTime = 0 } = req.body;
  
  // Map the questionnaire responses to our structured format
  const structuredResponses = {
    spirituality_importance: responses.spirituality_importance,
    premarital_counseling: responses.premarital_counseling,
    shared_interests_importance: responses.shared_interests_importance,
    relocation_openness: responses.relocation_openness,
    children_perspective: responses.children_perspective,
    caste_importance: responses.caste_importance,
    weekend_preferences: Array.isArray(responses.weekend_preferences) ? responses.weekend_preferences : [],
    family_independence_scenario: responses.family_independence_scenario,
    hobbies_activities: Array.isArray(responses.hobbies_activities) ? responses.hobbies_activities : [],
    drinking_habits: responses.drinking_habits,
    smoking_habits: responses.smoking_habits,
    relationship_reasons: Array.isArray(responses.relationship_reasons) ? responses.relationship_reasons : [],
    career_opportunity_scenario: responses.career_opportunity_scenario,
    family_gathering_scenario: responses.family_gathering_scenario
  };
  
  // Check if user already has an assessment
  let assessment = await Assessment.findOne({ userId: req.user.id });
  
  if (assessment) {
    // Update existing assessment
    assessment.responses = { ...assessment.responses, ...structuredResponses };
    assessment.completionTime = completionTime || assessment.completionTime;
    assessment.isComplete = true;
    assessment.completedAt = new Date();
    
    await assessment.save();
  } else {
    // Create new assessment
    assessment = await Assessment.create({
      name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      email: req.user.email,
      phone: req.user.phoneNumber || '',
      userId: req.user.id,
      responses: structuredResponses,
      completionTime,
      source: 'user_assessment',
      isComplete: true,
      completedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      submittedFrom: 'website'
    });
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      assessment
    }
  });
}));

// GET /api/assessments/compatibility/:assessmentId - Calculate compatibility with another assessment
router.get('/compatibility/:assessmentId', catchAsync(async (req, res, next) => {
  const myAssessment = await Assessment.findOne({ userId: req.user.id });
  const otherAssessment = await Assessment.findById(req.params.assessmentId);
  
  if (!myAssessment) {
    return next(new AppError('You need to complete the assessment first', 400));
  }
  
  if (!otherAssessment) {
    return next(new AppError('Other assessment not found', 404));
  }
  
  const compatibilityScore = myAssessment.calculateCompatibilityWith(otherAssessment);
  
  res.json({
    status: 'success',
    data: {
      compatibilityScore,
      otherUser: {
        name: otherAssessment.name,
        email: otherAssessment.email
      },
      calculatedAt: new Date().toISOString()
    }
  });
}));

// GET /api/assessments/matches - Find compatible assessments
router.get('/matches', catchAsync(async (req, res, next) => {
  const { minCompatibility = 70, limit = 10 } = req.query;
  
  const myAssessment = await Assessment.findOne({ userId: req.user.id });
  
  if (!myAssessment) {
    return next(new AppError('You need to complete the assessment first', 400));
  }
  
  const compatibleAssessments = await Assessment.findCompatibleAssessments(
    myAssessment.email,
    parseInt(minCompatibility),
    parseInt(limit)
  );
  
  // Calculate compatibility scores for each assessment
  const matches = compatibleAssessments.map(assessment => {
    const compatibilityScore = myAssessment.calculateCompatibilityWith(assessment);
    return {
      user: {
        name: assessment.name,
        email: assessment.email,
        phone: assessment.phone
      },
      compatibilityScore,
      completedAt: assessment.completedAt
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

// GET /api/assessments - Get all assessments with filters (admin only)
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    isComplete, 
    source,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  // Build filter object
  const filter = {};
  if (isComplete !== undefined) filter.isComplete = isComplete === 'true';
  if (source) filter.source = source;
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const assessments = await Assessment.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'firstName lastName email phoneNumber');
    
  const total = await Assessment.countDocuments(filter);
  
  res.json({
    status: 'success',
    results: assessments.length,
    data: {
      assessments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// GET /api/assessments/:id - Get specific assessment (admin only)
router.get('/:id', catchAsync(async (req, res, next) => {
  const assessment = await Assessment.findById(req.params.id)
    .populate('userId', 'firstName lastName email phoneNumber');
  
  if (!assessment) {
    return next(new AppError('Assessment not found', 404));
  }
  
  res.json({
    status: 'success',
    data: {
      assessment
    }
  });
}));

// DELETE /api/assessments/:id - Delete assessment (admin only)
router.delete('/:id', catchAsync(async (req, res, next) => {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  
  if (!assessment) {
    return next(new AppError('Assessment not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

module.exports = router;