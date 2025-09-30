const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  // Basic Blog Information
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  
  // SEO Fields
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  keywords: [{
    type: String,
    trim: true
  }],
  
  // Media
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  
  // Categorization
  category: {
    type: String,
    enum: [
      'relationship-advice',
      'marriage-tips', 
      'dating-guide',
      'wedding-planning',
      'love-stories',
      'matchmaking-insights',
      'cultural-traditions',
      'success-stories'
    ],
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Author Information
  author: {
    name: {
      type: String,
      required: true,
      default: 'MakeMyKnot Team'
    },
    email: String,
    bio: String,
    avatar: String
  },
  
  // Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  
  // Comments (basic structure)
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  comments: [{
    author: {
      name: String,
      email: String
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    approved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Reading Time
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  
  // Related Content
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  
  // Admin tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ '$**': 'text' }); // Text search index

// Virtual for full URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Virtual for formatted publish date
blogSchema.virtual('formattedDate').get(function() {
  return this.publishedAt ? this.publishedAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
});

// Pre-save middleware to generate slug if not provided
blogSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set publishedAt if status changed to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate reading time based on content
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  next();
});

// Static method to get published blogs
blogSchema.statics.getPublished = function(limit = 10, page = 1) {
  return this.find({ 
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .skip((page - 1) * limit)
  .populate('createdBy', 'firstName lastName');
};

// Static method to get blogs by category
blogSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    status: 'published',
    category: category,
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Instance method to increment views
blogSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save();
};

// Static method to get popular posts
blogSchema.statics.getPopular = function(limit = 5) {
  return this.find({ 
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ views: -1, likes: -1 })
  .limit(limit);
};

// Static method for search
blogSchema.statics.search = function(query, limit = 10) {
  return this.find({
    $and: [
      { status: 'published' },
      { publishedAt: { $lte: new Date() } },
      {
        $or: [
          { $text: { $search: query } },
          { title: { $regex: query, $options: 'i' } },
          { excerpt: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  })
  .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Blog', blogSchema);