const express = require('express');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes (no auth required) - Allow anyone to submit leads
// POST /api/leads - Create a new lead (PUBLIC ACCESS)
router.post('/', catchAsync(async (req, res) => {
  // Add CORS headers for public access
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const { 
    name, 
    email, 
    phone, 
    password,
    dateOfBirth,
    countryCode,
    answers, 
    source = 'website'
  } = req.body;
  
  // Extract structured fields from answers if they exist
  const structuredData = {
    name,
    email: email.toLowerCase(),
    phone,
    password,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    countryCode: countryCode || '+91',
    source,
    
    // Lead Questionnaire Fields
    matchmakingExperience: answers?.matchmaking_experience,
    genderIdentity: answers?.gender_identity,
    openToMeeting: answers?.open_to_meeting,
    preferredAgeRange: answers?.preferred_age_range,
    currentLocation: answers?.current_location,
    
    // Additional Profile Data
    hasBiodata: answers?.hasBiodata || false,
    biodataFileName: answers?.biodataFileName,
    
    // Keep original answers for backward compatibility
    answers: answers || {}
  };
  
  // Remove undefined fields
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });
  
  // Check if lead with this email already exists
  const existingLead = await Lead.findOne({ email: email.toLowerCase() });
  
  let lead;
  if (existingLead) {
    // Update existing lead with new structured data
    Object.assign(existingLead, structuredData);
    existingLead.answers = { ...existingLead.answers, ...answers };
    existingLead.status = existingLead.status === 'deleted' ? 'new' : existingLead.status;
    
    // Recalculate lead score
    existingLead.calculateLeadScore();
    
    lead = await existingLead.save();
  } else {
    // Create new lead with structured data
    lead = await Lead.create(structuredData);
    
    // Calculate initial lead score
    lead.calculateLeadScore();
    await lead.save();
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      lead
    }
  });
}));

// GET /api/leads/admin - Get all leads for admin (PUBLIC for now)
router.get('/admin', catchAsync(async (req, res) => {
  const leads = await Lead.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(100) // Limit to recent 100 leads
    .select('-__v');
  
  res.json({
    status: 'success',
    results: leads.length,
    data: {
      leads
    }
  });
}));

// Protected routes (authentication required)
router.use(protect);

// GET /api/leads - Get all leads with filters
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    source, 
    assignedTo,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  // Build filter object
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (assignedTo) filter.assignedTo = assignedTo;
  
  // Add search functionality
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const leads = await Lead.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('assignedTo', 'firstName lastName email')
    .exec();
    
  const total = await Lead.countDocuments(filter);
  
  res.json({
    status: 'success',
    results: leads.length,
    data: {
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// GET /api/leads/:id - Get single lead
router.get('/:id', catchAsync(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName email')
    .populate('notes.addedBy', 'firstName lastName email');
    
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  
  res.json({
    status: 'success',
    data: {
      lead
    }
  });
}));

// PATCH /api/leads/:id - Update lead
router.patch('/:id', catchAsync(async (req, res, next) => {
  const { name, email, phone, answers, status, assignedTo, followUpDate } = req.body;
  
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  
  // Update fields
  if (name) lead.name = name;
  if (email) lead.email = email;
  if (phone) lead.phone = phone;
  if (answers) lead.answers = { ...lead.answers, ...answers };
  if (status) lead.status = status;
  if (assignedTo) lead.assignedTo = assignedTo;
  if (followUpDate) lead.followUpDate = followUpDate;
  
  // Recalculate lead score
  lead.calculateLeadScore();
  
  await lead.save();
  
  res.json({
    status: 'success',
    data: {
      lead
    }
  });
}));

// DELETE /api/leads/:id - Soft delete lead
router.delete('/:id', catchAsync(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  
  lead.status = 'deleted';
  lead.isActive = false;
  await lead.save();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// POST /api/leads/:id/notes - Add note to lead
router.post('/:id/notes', catchAsync(async (req, res, next) => {
  const { message } = req.body;
  
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  
  lead.notes.push({
    message,
    addedBy: req.user.id
  });
  
  await lead.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      lead
    }
  });
}));

// PATCH /api/leads/:id/verify - Mark lead as verified
router.patch('/:id/verify', catchAsync(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new AppError('Lead not found', 404));
  }
  
  lead.status = 'verified';
  await lead.save();
  
  res.json({
    status: 'success',
    data: {
      lead
    }
  });
}));

// GET /api/leads/analytics/summary - Get leads analytics
router.get('/analytics/summary', catchAsync(async (req, res) => {
  const { dateRange = 30 } = req.query;
  
  const analytics = await Lead.getAnalytics(dateRange);
  
  res.json({
    status: 'success',
    data: {
      analytics: analytics[0] // aggregate returns array with one result
    }
  });
}));

module.exports = router;
