const express = require('express');
const Nomination = require('../models/Nomination');
const { protect } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public route - Submit a new nomination
router.post('/submit', catchAsync(async (req, res) => {
  // Add CORS headers for public access
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const {
    nominatorName,
    nominatorEmail,
    nominatorPhone,
    nomineeName,
    nomineeEmail,
    nomineePhone,
    relationship,
    reason,
    nomineeKnows
  } = req.body;
  
  // Validate required fields
  if (!nominatorName || !nominatorEmail || !nomineeName || !nomineeEmail || !relationship || !reason) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields. Please provide nominator name, email, nominee name, email, relationship, and reason.'
    });
  }
  
  // Check if this nominee has already been nominated
  const existingNomination = await Nomination.findOne({ 
    nomineeEmail: nomineeEmail.toLowerCase() 
  });
  
  if (existingNomination) {
    return res.status(200).json({
      status: 'success',
      message: 'Thank you! This person has already been nominated. We will reach out to them soon.',
      data: { alreadyNominated: true }
    });
  }
  
  // Create nomination
  const nominationData = {
    nominatorName: nominatorName.trim(),
    nominatorEmail: nominatorEmail.toLowerCase().trim(),
    nominatorPhone: nominatorPhone?.trim() || '',
    nomineeName: nomineeName.trim(),
    nomineeEmail: nomineeEmail.toLowerCase().trim(),
    nomineePhone: nomineePhone?.trim() || '',
    relationship,
    reason: reason.trim(),
    nomineeKnows: Boolean(nomineeKnows),
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    source: 'website'
  };
  
  const nomination = await Nomination.create(nominationData);
  
  console.log('✅ New nomination submitted:', {
    id: nomination._id,
    nominator: nominatorName,
    nominee: nomineeName,
    relationship
  });
  
  res.status(201).json({
    status: 'success',
    message: 'Nomination submitted successfully! We will reach out to them soon.',
    data: {
      nomination: {
        id: nomination._id,
        nomineeName: nomination.nomineeName,
        status: nomination.status,
        submittedAt: nomination.createdAt
      }
    }
  });
}));

// Admin routes - require authentication
router.use(protect);

// GET /api/nominations - Get all nominations with filtering and pagination
router.get('/', catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    contacted,
    assignedTo,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (contacted !== undefined) filter.contacted = contacted === 'true';
  if (assignedTo) filter.assignedTo = assignedTo;
  
  // Add search functionality
  if (search) {
    filter.$or = [
      { nominatorName: { $regex: search, $options: 'i' } },
      { nominatorEmail: { $regex: search, $options: 'i' } },
      { nomineeName: { $regex: search, $options: 'i' } },
      { nomineeEmail: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const nominations = await Nomination.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
    
  const total = await Nomination.countDocuments(filter);
  
  res.json({
    status: 'success',
    results: nominations.length,
    data: {
      nominations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// GET /api/nominations/admin - Get all nominations for admin (simple endpoint)
router.get('/admin', catchAsync(async (req, res) => {
  const nominations = await Nomination.find({})
    .sort({ createdAt: -1 })
    .limit(100) // Limit to recent 100 nominations
    .select('-__v');
  
  res.json({
    status: 'success',
    results: nominations.length,
    data: {
      nominations
    }
  });
}));

// GET /api/nominations/analytics - Get nomination analytics
router.get('/analytics', catchAsync(async (req, res) => {
  const analytics = await Nomination.getAnalytics();
  const needingAttention = await Nomination.getNominationsNeedingAttention();
  
  res.json({
    status: 'success',
    data: {
      analytics: analytics[0] || {
        totalNominations: 0,
        newNominations: 0,
        contactedNominations: 0,
        joinedNominations: 0,
        thisWeekNominations: 0,
        thisMonthNominations: 0
      },
      needingAttention: needingAttention.length
    }
  });
}));

// GET /api/nominations/needing-attention - Get nominations that need follow-up
router.get('/needing-attention', catchAsync(async (req, res) => {
  const nominations = await Nomination.getNominationsNeedingAttention();
  
  res.json({
    status: 'success',
    results: nominations.length,
    data: {
      nominations
    }
  });
}));

// GET /api/nominations/:id - Get single nomination
router.get('/:id', catchAsync(async (req, res, next) => {
  const nomination = await Nomination.findById(req.params.id);
  
  if (!nomination) {
    return next(new AppError('Nomination not found', 404));
  }
  
  res.json({
    status: 'success',
    data: {
      nomination
    }
  });
}));

// PATCH /api/nominations/:id - Update nomination
router.patch('/:id', catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    'status', 
    'contacted', 
    'contactedAt', 
    'adminNotes', 
    'assignedTo', 
    'priority',
    'joinedAsUser'
  ];
  
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  // If marking as contacted, set contactedAt
  if (updates.contacted === true && !updates.contactedAt) {
    updates.contactedAt = new Date();
  }
  
  const nomination = await Nomination.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!nomination) {
    return next(new AppError('Nomination not found', 404));
  }
  
  console.log('✅ Nomination updated:', {
    id: nomination._id,
    status: nomination.status,
    contacted: nomination.contacted
  });
  
  res.json({
    status: 'success',
    data: {
      nomination
    }
  });
}));

// DELETE /api/nominations/:id - Delete nomination
router.delete('/:id', catchAsync(async (req, res, next) => {
  const nomination = await Nomination.findByIdAndDelete(req.params.id);
  
  if (!nomination) {
    return next(new AppError('Nomination not found', 404));
  }
  
  console.log('❌ Nomination deleted:', {
    id: req.params.id,
    nominee: nomination.nomineeName
  });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// POST /api/nominations/:id/contact - Mark nomination as contacted
router.post('/:id/contact', catchAsync(async (req, res, next) => {
  const { notes } = req.body;
  
  const nomination = await Nomination.findByIdAndUpdate(
    req.params.id,
    {
      contacted: true,
      contactedAt: new Date(),
      status: 'contacted',
      adminNotes: notes ? `${notes}\n\n--- Contacted on ${new Date().toLocaleString()} ---` : nomination.adminNotes
    },
    { new: true }
  );
  
  if (!nomination) {
    return next(new AppError('Nomination not found', 404));
  }
  
  console.log('📞 Nomination marked as contacted:', {
    id: nomination._id,
    nominee: nomination.nomineeName
  });
  
  res.json({
    status: 'success',
    message: 'Nomination marked as contacted',
    data: {
      nomination
    }
  });
}));

// PATCH /api/nominations/bulk-update - Bulk update nominations
router.patch('/bulk-update', catchAsync(async (req, res) => {
  const { nominationIds, updates } = req.body;
  
  if (!nominationIds || !Array.isArray(nominationIds) || nominationIds.length === 0) {
    return next(new AppError('Please provide nomination IDs to update', 400));
  }
  
  // Only allow certain fields to be bulk updated
  const allowedBulkUpdates = ['status', 'contacted', 'assignedTo', 'priority'];
  const bulkUpdates = {};
  
  allowedBulkUpdates.forEach(field => {
    if (updates[field] !== undefined) {
      bulkUpdates[field] = updates[field];
    }
  });
  
  if (bulkUpdates.contacted === true) {
    bulkUpdates.contactedAt = new Date();
  }
  
  const result = await Nomination.updateMany(
    { _id: { $in: nominationIds } },
    bulkUpdates
  );
  
  console.log('✅ Bulk updated nominations:', {
    count: result.modifiedCount,
    updates: bulkUpdates
  });
  
  res.json({
    status: 'success',
    message: `Updated ${result.modifiedCount} nominations`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}));

module.exports = router;