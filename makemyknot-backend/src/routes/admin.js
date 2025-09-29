const express = require('express');
const Admin = require('../models/Admin');
const AdminData = require('../models/AdminData');
const { protect, restrictTo } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes
// POST /api/admin/login - Admin login
router.post('/login', catchAsync(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide username and password'
    });
  }

  // Find admin with password field
  const admin = await Admin.findOne({ 
    $or: [{ username }, { email: username }],
    isActive: true 
  }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    // Increment login attempts if admin exists
    if (admin) {
      await admin.incLoginAttempts();
    }
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }

  // Check if account is locked
  if (admin.isLocked) {
    return res.status(423).json({
      status: 'error',
      message: 'Account temporarily locked due to multiple failed login attempts'
    });
  }

  // Reset login attempts on successful login
  await admin.resetLoginAttempts();
  
  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Generate JWT token (you'll need to implement JWT logic)
  const token = 'jwt-token-here'; // Replace with actual JWT generation

  res.json({
    status: 'success',
    token,
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions,
        settings: admin.settings
      }
    }
  });
}));

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

// GET /api/admin/me - Get current admin profile
router.get('/me', catchAsync(async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  
  res.json({
    status: 'success',
    data: {
      admin
    }
  });
}));

// PATCH /api/admin/me - Update admin profile
router.patch('/me', catchAsync(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, settings } = req.body;

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.user.id,
    { 
      firstName,
      lastName, 
      email,
      phoneNumber,
      settings,
      updatedBy: req.user.id
    },
    { 
      new: true, 
      runValidators: true 
    }
  );

  res.json({
    status: 'success',
    data: {
      admin: updatedAdmin
    }
  });
}));

// POST /api/admin/change-password - Change password
router.post('/change-password', catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide current and new password'
    });
  }

  // Get admin with password
  const admin = await Admin.findById(req.user.id).select('+password');

  if (!(await admin.correctPassword(currentPassword, admin.password))) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password is incorrect'
    });
  }

  admin.password = newPassword;
  await admin.save();

  res.json({
    status: 'success',
    message: 'Password updated successfully'
  });
}));

// Admin Management Routes (Super Admin only)
router.use(restrictTo('super_admin'));

// GET /api/admin/list - Get all admins
router.get('/list', catchAsync(async (req, res) => {
  const { page = 1, limit = 10, role, isActive } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const admins = await Admin.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('createdBy', 'firstName lastName email')
    .populate('updatedBy', 'firstName lastName email');

  const total = await Admin.countDocuments(filter);

  res.json({
    status: 'success',
    results: admins.length,
    data: {
      admins,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// POST /api/admin/create - Create new admin
router.post('/create', catchAsync(async (req, res) => {
  const { username, email, password, firstName, lastName, phoneNumber, role } = req.body;

  const newAdmin = await Admin.create({
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    permissions: Admin.getDefaultPermissions(role),
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      admin: newAdmin
    }
  });
}));

// PATCH /api/admin/:id - Update admin
router.patch('/:id', catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, role, permissions, isActive } = req.body;

  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      permissions,
      isActive,
      updatedBy: req.user.id
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    status: 'success',
    data: {
      admin: updatedAdmin
    }
  });
}));

// DELETE /api/admin/:id - Deactivate admin
router.delete('/:id', catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  // Don't allow deleting super admin
  if (admin.role === 'super_admin') {
    return next(new AppError('Cannot deactivate super admin', 403));
  }

  admin.isActive = false;
  admin.updatedBy = req.user.id;
  await admin.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// Admin Data Management Routes
// GET /api/admin/data/:key - Get admin data by key
router.get('/data/:key', catchAsync(async (req, res, next) => {
  const adminData = await AdminData.findOne({ key: req.params.key });
  
  if (!adminData) {
    return next(new AppError('Admin data not found', 404));
  }

  res.json({
    status: 'success',
    data: {
      adminData
    }
  });
}));

// POST /api/admin/data - Save admin data
router.post('/data', catchAsync(async (req, res) => {
  const { key, data } = req.body;

  if (!key || !data) {
    return res.status(400).json({
      status: 'error',
      message: 'Key and data are required'
    });
  }

  const existingData = await AdminData.findOne({ key });

  if (existingData) {
    // Update existing data
    existingData.data = data;
    existingData.updatedAt = new Date();
    await existingData.save();

    return res.json({
      status: 'success',
      message: 'Admin data updated successfully',
      data: {
        adminData: existingData
      }
    });
  }

  // Create new admin data
  const newAdminData = await AdminData.create({
    key,
    data,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    message: 'Admin data saved successfully',
    data: {
      adminData: newAdminData
    }
  });
}));

// PATCH /api/admin/data/:key - Update admin data
router.patch('/data/:key', catchAsync(async (req, res, next) => {
  const { data } = req.body;

  const adminData = await AdminData.findOne({ key: req.params.key });
  
  if (!adminData) {
    return next(new AppError('Admin data not found', 404));
  }

  adminData.data = { ...adminData.data, ...data };
  adminData.updatedAt = new Date();
  await adminData.save();

  res.json({
    status: 'success',
    data: {
      adminData
    }
  });
}));

// DELETE /api/admin/data/:key - Delete admin data
router.delete('/data/:key', catchAsync(async (req, res, next) => {
  const adminData = await AdminData.findOne({ key: req.params.key });
  
  if (!adminData) {
    return next(new AppError('Admin data not found', 404));
  }

  await AdminData.deleteOne({ key: req.params.key });

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// GET /api/admin/data - Get all admin data
router.get('/data', catchAsync(async (req, res) => {
  const { page = 1, limit = 50, key } = req.query;

  const filter = {};
  if (key) filter.key = { $regex: key, $options: 'i' };

  const adminData = await AdminData.find(filter)
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await AdminData.countDocuments(filter);

  res.json({
    status: 'success',
    results: adminData.length,
    data: {
      adminData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

module.exports = router;