const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/biodata');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const email = req.body.email || 'unknown';
    const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    cb(null, `biodata_${sanitizedEmail}_${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for biodata uploads
const biodataFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and JPEG files are allowed.'), false);
  }
};

// Configure multer upload
const uploadBiodata = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: biodataFilter
}).single('biodataFile'); // Single file upload with field name 'biodataFile'

// Error handling middleware for multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size too large. Maximum 5MB allowed.'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next(err);
};

module.exports = {
  uploadBiodata,
  handleUploadErrors
};