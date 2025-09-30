const express = require('express');
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Public routes (no auth required)

// GET /api/blog - Get published blogs with pagination
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    tag, 
    search,
    featured = false 
  } = req.query;

  let query = { 
    status: 'published', 
    publishedAt: { $lte: new Date() } 
  };

  // Add category filter
  if (category) {
    query.category = category;
  }

  // Add tag filter
  if (tag) {
    query.tags = { $in: [tag] };
  }

  // Add search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Add featured filter
  if (featured === 'true') {
    query.featured = true;
  }

  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .populate('createdBy', 'firstName lastName username')
    .select('-content'); // Exclude full content for list view

  const total = await Blog.countDocuments(query);

  res.json({
    status: 'success',
    results: blogs.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    data: {
      blogs
    }
  });
}));

// GET /api/blog/categories - Get all categories with post counts
router.get('/categories', catchAsync(async (req, res) => {
  const categories = await Blog.aggregate([
    { $match: { status: 'published', publishedAt: { $lte: new Date() } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    status: 'success',
    data: {
      categories: categories.map(cat => ({
        name: cat._id,
        count: cat.count,
        displayName: cat._id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }))
    }
  });
}));

// GET /api/blog/tags - Get popular tags
router.get('/tags', catchAsync(async (req, res) => {
  const tags = await Blog.aggregate([
    { $match: { status: 'published', publishedAt: { $lte: new Date() } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.json({
    status: 'success',
    data: {
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    }
  });
}));

// GET /api/blog/popular - Get popular posts
router.get('/popular', catchAsync(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const blogs = await Blog.getPopular(parseInt(limit));
  
  res.json({
    status: 'success',
    results: blogs.length,
    data: { blogs }
  });
}));

// GET /api/blog/recent - Get recent posts
router.get('/recent', catchAsync(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const blogs = await Blog.find({ 
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(parseInt(limit))
  .select('title slug excerpt featuredImage publishedAt readingTime category');
  
  res.json({
    status: 'success',
    results: blogs.length,
    data: { blogs }
  });
}));

// GET /api/blog/search - Search blogs
router.get('/search', catchAsync(async (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      status: 'error',
      message: 'Search query is required'
    });
  }
  
  const blogs = await Blog.search(q, parseInt(limit));
  
  res.json({
    status: 'success',
    results: blogs.length,
    data: { blogs }
  });
}));

// GET /api/blog/:slug - Get single blog by slug
router.get('/:slug', catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ 
    slug: req.params.slug, 
    status: 'published',
    publishedAt: { $lte: new Date() }
  }).populate('createdBy', 'firstName lastName username');

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  // Increment view count
  await blog.incrementViews();

  // Get related posts
  const relatedPosts = await Blog.find({
    _id: { $ne: blog._id },
    status: 'published',
    publishedAt: { $lte: new Date() },
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags } }
    ]
  })
  .limit(3)
  .select('title slug excerpt featuredImage publishedAt readingTime category');

  res.json({
    status: 'success',
    data: {
      blog: {
        ...blog.toObject(),
        relatedPosts
      }
    }
  });
}));

// Protected routes (admin only)
router.use(protect, adminOnly);

// GET /api/blog/admin/all - Get all blogs for admin (including drafts)
router.get('/admin/all', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    category, 
    author,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (author) query.createdBy = author;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const blogs = await Blog.find(query)
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .populate('createdBy', 'firstName lastName username')
    .populate('lastModifiedBy', 'firstName lastName username');

  const total = await Blog.countDocuments(query);

  res.json({
    status: 'success',
    results: blogs.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    },
    data: { blogs }
  });
}));

// POST /api/blog - Create new blog post
router.post('/', catchAsync(async (req, res) => {
  const blogData = {
    ...req.body,
    createdBy: req.user.id,
    author: {
      name: req.body.author?.name || `${req.user.firstName} ${req.user.lastName}`,
      email: req.body.author?.email || req.user.email,
      ...req.body.author
    }
  };

  const blog = await Blog.create(blogData);

  res.status(201).json({
    status: 'success',
    data: { blog }
  });
}));

// GET /api/blog/admin/:id - Get blog by ID for admin
router.get('/admin/:id', catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate('createdBy', 'firstName lastName username')
    .populate('lastModifiedBy', 'firstName lastName username');

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.json({
    status: 'success',
    data: { blog }
  });
}));

// PUT /api/blog/:id - Update blog post
router.put('/:id', catchAsync(async (req, res, next) => {
  const updateData = {
    ...req.body,
    lastModifiedBy: req.user.id
  };

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  ).populate('createdBy', 'firstName lastName username');

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.json({
    status: 'success',
    data: { blog }
  });
}));

// DELETE /api/blog/:id - Delete blog post
router.delete('/:id', catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}));

// POST /api/blog/:id/publish - Publish blog post
router.post('/:id/publish', catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'published',
      publishedAt: new Date(),
      lastModifiedBy: req.user.id
    },
    { new: true }
  );

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.json({
    status: 'success',
    message: 'Blog post published successfully',
    data: { blog }
  });
}));

// POST /api/blog/:id/unpublish - Unpublish blog post
router.post('/:id/unpublish', catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'draft',
      lastModifiedBy: req.user.id
    },
    { new: true }
  );

  if (!blog) {
    return next(new AppError('Blog post not found', 404));
  }

  res.json({
    status: 'success',
    message: 'Blog post unpublished successfully',
    data: { blog }
  });
}));

module.exports = router;