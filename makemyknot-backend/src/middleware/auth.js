const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    message,
    user
  });
};

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verification token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token. Please log in again!'
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Your token has expired! Please log in again.'
        });
      }
      throw error;
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+password');
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // 5) Check if user is suspended
    if (currentUser.suspendedUntil && currentUser.suspendedUntil > new Date()) {
      return res.status(403).json({
        status: 'fail',
        message: `Your account is suspended until ${currentUser.suspendedUntil}. Reason: ${currentUser.suspensionReason || 'Not specified'}`
      });
    }

    // 6) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.'
      });
    }

    // 7) Update last active timestamp
    currentUser.updateLastActive();

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication error. Please try again.'
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin', 'moderator']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        
        if (currentUser && currentUser.isActive) {
          req.user = currentUser;
          currentUser.updateLastActive();
        }
      } catch (error) {
        // If token is invalid, just continue without user
        console.log('Optional auth - invalid token:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Middleware to check if email is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.verification.isEmailVerified) {
    return res.status(403).json({
      status: 'fail',
      message: 'Please verify your email address before accessing this resource.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// Middleware to check subscription level
const requireSubscription = (requiredLevel) => {
  const subscriptionHierarchy = {
    'free': 0,
    'premium': 1,
    'gold': 2
  };

  return (req, res, next) => {
    const userLevel = req.user.subscription?.type || 'free';
    const userLevelValue = subscriptionHierarchy[userLevel];
    const requiredLevelValue = subscriptionHierarchy[requiredLevel];

    if (userLevelValue < requiredLevelValue) {
      return res.status(403).json({
        status: 'fail',
        message: `This feature requires ${requiredLevel} subscription.`,
        code: 'SUBSCRIPTION_REQUIRED',
        requiredSubscription: requiredLevel,
        currentSubscription: userLevel
      });
    }
    next();
  };
};

module.exports = {
  signToken,
  createSendToken,
  protect,
  restrictTo,
  adminOnly,
  optionalAuth,
  requireEmailVerification,
  requireSubscription
};
