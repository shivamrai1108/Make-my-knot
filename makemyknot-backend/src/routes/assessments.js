const express = require('express');
const Assessment = require('../models/Assessment');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes (no auth required) for assessment submissions
// POST /api/assessments/public - Create assessment response from lead or user (PUBLIC ACCESS)
router.post('/public', catchAsync(async (req, res) => {
  try {
    console.log('🔄 Assessment submission started:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      bodyKeys: Object.keys(req.body),
      hasResponses: !!req.body.responses,
      responseKeys: req.body.responses ? Object.keys(req.body.responses) : []
    });
    
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
    
    // Enhanced validation with specific error messages
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!responses) missingFields.push('responses');
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_FIELDS',
        details: { missingFields }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address',
        code: 'INVALID_EMAIL'
      });
    }
    
    // Validate responses object
    if (typeof responses !== 'object' || responses === null) {
      console.error('❌ Invalid responses format:', typeof responses);
      return res.status(400).json({
        status: 'error',
        message: 'Responses must be a valid object containing assessment answers',
        code: 'INVALID_RESPONSES_FORMAT'
      });
    }
  
    // Map the questionnaire responses to our structured format with validation
    console.log('🗺️ Mapping responses to structured format...');
    const structuredResponses = {};
    
    try {
      // Map each response with individual error checking
      const responseMapping = {
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
      
      // Validate each mapped response
      const invalidResponses = [];
      Object.entries(responseMapping).forEach(([key, value]) => {
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0 && key !== 'weekend_preferences' && key !== 'hobbies_activities' && key !== 'relationship_reasons')) {
          invalidResponses.push(key);
        } else {
          structuredResponses[key] = value;
        }
      });
      
      if (invalidResponses.length > 0) {
        console.error('❌ Invalid or missing response values:', invalidResponses);
        return res.status(400).json({
          status: 'error',
          message: `Please provide valid answers for: ${invalidResponses.join(', ')}`,
          code: 'INVALID_RESPONSES',
          details: { invalidResponses }
        });
      }
      
      console.log('✅ Response mapping successful. Questions answered:', Object.keys(structuredResponses).length);
      
    } catch (mappingError) {
      console.error('❌ Error mapping responses:', mappingError);
      return res.status(400).json({
        status: 'error',
        message: 'Error processing assessment responses. Please check your answers and try again.',
        code: 'RESPONSE_MAPPING_ERROR'
      });
    }
  
    // Prepare assessment data
    console.log('📦 Preparing assessment data...');
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
    
    console.log('📦 Assessment data prepared:', {
      name: assessmentData.name,
      email: assessmentData.email,
      phone: assessmentData.phone,
      source: assessmentData.source,
      leadId: assessmentData.leadId,
      responseCount: Object.keys(structuredResponses).length
    });
    
    // Database operations with detailed error handling
    console.log('🔍 Checking for existing assessment...');
    let assessment;
    
    try {
      assessment = await Assessment.findOne({ email: assessmentData.email });
      console.log('🔍 Database query result:', assessment ? 'Existing assessment found' : 'No existing assessment');
    } catch (dbError) {
      console.error('❌ Database query error:', {
        error: dbError.message,
        code: dbError.code,
        name: dbError.name
      });
      return res.status(500).json({
        status: 'error',
        message: 'Database connection error. Please try again in a moment.',
        code: 'DATABASE_QUERY_ERROR'
      });
    }
    
    try {
      if (assessment) {
        // Update existing assessment
        console.log('🔄 Updating existing assessment...');
        Object.assign(assessment, assessmentData);
        assessment.responses = { ...assessment.responses, ...structuredResponses };
        assessment.isComplete = true;
        assessment.completedAt = new Date();
        
        await assessment.save();
        console.log('✅ Updated existing assessment for:', assessmentData.email);
      } else {
        // Create new assessment
        console.log('🆕 Creating new assessment...');
        assessmentData.isComplete = true;
        assessmentData.completedAt = new Date();
        
        assessment = await Assessment.create(assessmentData);
        console.log('✅ Created new assessment for:', assessmentData.email, 'ID:', assessment._id);
      }
    } catch (saveError) {
      console.error('❌ Assessment save error:', {
        error: saveError.message,
        code: saveError.code,
        name: saveError.name,
        validationErrors: saveError.errors ? Object.keys(saveError.errors) : 'None'
      });
      
      // Handle specific MongoDB validation errors
      if (saveError.name === 'ValidationError') {
        const validationMessages = Object.values(saveError.errors).map(err => err.message);
        return res.status(400).json({
          status: 'error',
          message: `Assessment validation failed: ${validationMessages.join(', ')}`,
          code: 'VALIDATION_ERROR',
          details: { validationErrors: validationMessages }
        });
      }
      
      // Handle duplicate key errors
      if (saveError.code === 11000) {
        return res.status(400).json({
          status: 'error',
          message: 'An assessment with this email already exists.',
          code: 'DUPLICATE_ASSESSMENT'
        });
      }
      
      // Generic database error
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save assessment. Please try again.',
        code: 'DATABASE_SAVE_ERROR'
      });
    }
  
    // Success response
    console.log('🎉 Assessment submission completed successfully!', {
      assessmentId: assessment._id,
      email: assessmentData.email,
      completionPercentage: assessment.completionPercentage
    });
    
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
    
  } catch (unexpectedError) {
    // Catch any unexpected errors not handled above
    console.error('❌ Unexpected error in assessment submission:', {
      error: unexpectedError.message,
      stack: unexpectedError.stack,
      code: unexpectedError.code,
      name: unexpectedError.name
    });
    
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while processing your assessment. Please try again.',
      code: 'UNEXPECTED_ERROR'
    });
  }
}));

// PUT/PATCH /api/assessments/public/partial - Update assessment with partial progress (PUBLIC ACCESS)
router.put('/public/partial', catchAsync(async (req, res) => {
  try {
    console.log('🔄 Partial assessment update started:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      bodyKeys: Object.keys(req.body),
      hasResponses: !!req.body.responses
    });
    
    const { 
      name,
      email,
      phone,
      responses = {}, 
      leadId,
      userId,
      source = 'lead_assessment',
      sessionId
    } = req.body;
    
    // Basic validation
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required for partial assessment updates',
        code: 'MISSING_EMAIL'
      });
    }
    
    // Find existing assessment or create new one
    let assessment = await Assessment.findByEmailOrId(email, leadId, userId);
    
    if (!assessment) {
      // Create new partial assessment
      console.log('🆕 Creating new partial assessment for:', email);
      assessment = new Assessment({
        name: name || 'Unknown User',
        email: email.toLowerCase().trim(),
        phone: phone || '',
        leadId: leadId || null,
        userId: userId || null,
        source,
        responses: {},
        sessionId,
        status: 'started',
        isComplete: false,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        submittedFrom: 'website'
      });
    }
    
    // Update responses (merge with existing)
    Object.keys(responses).forEach(questionKey => {
      if (responses[questionKey] !== undefined && responses[questionKey] !== null) {
        assessment.addResponse(questionKey, responses[questionKey]);
      }
    });
    
    // Update other fields if provided
    if (name) assessment.name = name;
    if (phone) assessment.phone = phone;
    if (sessionId) assessment.sessionId = sessionId;
    
    await assessment.save();
    
    console.log('✅ Partial assessment updated:', {
      email,
      progress: assessment.completionPercentage,
      answeredQuestions: assessment.answeredQuestions,
      status: assessment.status
    });
    
    res.json({
      status: 'success',
      message: 'Assessment progress saved',
      data: {
        assessment: {
          id: assessment._id,
          name: assessment.name,
          email: assessment.email,
          isComplete: assessment.isComplete,
          status: assessment.status,
          completionPercentage: assessment.completionPercentage,
          answeredQuestions: assessment.answeredQuestions,
          totalQuestions: assessment.totalQuestions,
          lastUpdatedAt: assessment.lastUpdatedAt,
          responses: assessment.responses
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Partial assessment update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save assessment progress',
      code: 'PARTIAL_UPDATE_ERROR'
    });
  }
}));

router.patch('/public/partial', router.stack[router.stack.length - 1].route.stack[0].handle); // Alias PATCH to PUT

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
  const { includePartial = 'true', status, limit = 100 } = req.query;
  
  // Build filter
  const filter = {};
  if (status) filter.status = status;
  if (includePartial === 'false') filter.isComplete = true;
  
  const assessments = await Assessment.find(filter)
    .sort({ lastUpdatedAt: -1, createdAt: -1 }) // Show recent activity first
    .limit(parseInt(limit))
    .select('-__v');
  
  // Transform data for admin view with enhanced information
  const transformedAssessments = assessments.map(assessment => ({
    id: assessment._id,
    name: assessment.name,
    email: assessment.email,
    phone: assessment.phone,
    isComplete: assessment.isComplete,
    completedAt: assessment.completedAt,
    completionPercentage: assessment.completionPercentage,
    answeredQuestions: assessment.answeredQuestions || 0,
    totalQuestions: assessment.totalQuestions || 14,
    status: assessment.status || (assessment.isComplete ? 'completed' : 'started'),
    completionTime: assessment.completionTime,
    source: assessment.source,
    leadId: assessment.leadId,
    userId: assessment.userId,
    createdAt: assessment.createdAt,
    lastUpdatedAt: assessment.lastUpdatedAt || assessment.createdAt,
    startedAt: assessment.startedAt || assessment.createdAt,
    isPartiallyComplete: assessment.answeredQuestions > 0 && !assessment.isComplete,
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

// GET /api/assessments/admin/partial - Get partial assessments (PUBLIC for now)
router.get('/admin/partial', catchAsync(async (req, res) => {
  const partialAssessments = await Assessment.getPartialAssessments();
  
  const transformedAssessments = partialAssessments.map(assessment => ({
    id: assessment._id,
    name: assessment.name,
    email: assessment.email,
    phone: assessment.phone,
    completionPercentage: assessment.completionPercentage,
    answeredQuestions: assessment.answeredQuestions,
    totalQuestions: assessment.totalQuestions,
    status: assessment.status,
    source: assessment.source,
    leadId: assessment.leadId,
    userId: assessment.userId,
    createdAt: assessment.createdAt,
    lastUpdatedAt: assessment.lastUpdatedAt,
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

// GET /api/assessments/admin/abandoned - Get abandoned assessments (PUBLIC for now)
router.get('/admin/abandoned', catchAsync(async (req, res) => {
  const { daysAgo = 7 } = req.query;
  const abandonedAssessments = await Assessment.getAbandonedAssessments(parseInt(daysAgo));
  
  const transformedAssessments = abandonedAssessments.map(assessment => ({
    id: assessment._id,
    name: assessment.name,
    email: assessment.email,
    phone: assessment.phone,
    completionPercentage: assessment.completionPercentage,
    answeredQuestions: assessment.answeredQuestions,
    totalQuestions: assessment.totalQuestions,
    status: assessment.status,
    source: assessment.source,
    leadId: assessment.leadId,
    userId: assessment.userId,
    createdAt: assessment.createdAt,
    lastUpdatedAt: assessment.lastUpdatedAt,
    daysSinceLastUpdate: Math.floor((Date.now() - new Date(assessment.lastUpdatedAt).getTime()) / (1000 * 60 * 60 * 24)),
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