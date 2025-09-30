const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chats');
const leadRoutes = require('./routes/leads');
const notificationRoutes = require('./routes/notifications');
const questionnaireRoutes = require('./routes/questionnaires');
const assessmentRoutes = require('./routes/assessments');
const blogRoutes = require('./routes/blog');
const migrationRoutes = require('./routes/migration');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.MOBILE_CLIENT_URL],
    methods: ["GET", "POST"]
  }
});

// Global middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration for public access
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      process.env.MOBILE_CLIENT_URL || 'exp://localhost:19000',
      'http://localhost:19006', // Expo web
      'http://192.168.29.212:3000', // Network access for frontend
      'https://makemyknot.com', // Your production domain
      'https://www.makemyknot.com', // Your production domain with www
      /^https:\/\/.*\.makemyknot\.com$/, // Subdomains
      /^https:\/\/.*\.vercel\.app$/, // Vercel deployments
      /^https:\/\/.*\.netlify\.app$/, // Netlify deployments
      /^http:\/\/192\.168\.[0-9]+\.[0-9]+:3000$/, // Allow all local network IPs
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/makemyknot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    // Emit message to the recipient
    socket.to(`user-${data.recipientId}`).emit('new-message', data);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(`user-${data.recipientId}`).emit('user-typing', data);
  });

  socket.on('stop-typing', (data) => {
    socket.to(`user-${data.recipientId}`).emit('user-stop-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/migration', migrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Assessment collection initialization endpoint
app.post('/api/init/assessment', async (req, res) => {
  try {
    const { initializeAssessmentCollection } = require('../init-assessment-db');
    const result = await initializeAssessmentCollection();
    
    res.json({
      status: 'success',
      message: 'Assessment collection initialized successfully',
      data: result
    });
  } catch (error) {
    console.error('Assessment initialization failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to initialize Assessment collection',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server accessible on all network interfaces`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Local'}`);
  console.log(`🖥️  Local access: http://localhost:${PORT}`);
  console.log(`🌍 Network access: http://192.168.29.212:${PORT}`);
});

module.exports = { app, io };
