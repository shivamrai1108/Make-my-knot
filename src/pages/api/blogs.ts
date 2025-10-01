import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { getBlogsCollection } from '@/lib/mongodb'

// Fallback in-memory storage for when MongoDB is not configured
let fallbackBlogsStorage: Blog[] = []
const MONGODB_URI = process.env.MONGODB_URI
const USE_MONGODB = !!MONGODB_URI

// Log storage method on startup
if (USE_MONGODB) {
  console.log('🍃 Blog system using MongoDB for persistent storage')
} else {
  console.log('⚠️  Blog system using in-memory storage (data will be lost on restart)')
  console.log('   Add MONGODB_URI to .env.local for persistent storage')
}

interface Blog {
  _id?: ObjectId
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  author: string
  publishDate: string
  createdAt: string
  updatedAt: string
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  views?: number
}

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Helper function to generate excerpt from HTML content
function generateExcerpt(htmlContent: string, maxLength: number = 160): string {
  // Strip HTML tags and get plain text
  const plainText = htmlContent.replace(/<[^>]*>/g, '').trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

// Hybrid storage helper functions (MongoDB + fallback)
async function getAllBlogs(): Promise<Blog[]> {
  if (!USE_MONGODB) {
    return fallbackBlogsStorage
  }
  
  try {
    const collection = await getBlogsCollection()
    const blogs = await collection.find({}).toArray()
    return blogs.map(blog => ({
      ...blog,
      id: blog._id?.toString() || blog.id,
      _id: undefined // Remove _id from response
    })) as Blog[]
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    return fallbackBlogsStorage
  }
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!USE_MONGODB) {
    return fallbackBlogsStorage.find(blog => blog.slug === slug) || null
  }
  
  try {
    const collection = await getBlogsCollection()
    const blog = await collection.findOne({ slug })
    if (!blog) return null
    
    return {
      ...blog,
      id: blog._id?.toString() || blog.id,
      _id: undefined
    } as Blog
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    return fallbackBlogsStorage.find(blog => blog.slug === slug) || null
  }
}

async function getBlogById(id: string): Promise<Blog | null> {
  if (!USE_MONGODB) {
    return fallbackBlogsStorage.find(blog => blog.id === id) || null
  }
  
  try {
    const collection = await getBlogsCollection()
    const blog = await collection.findOne({ 
      $or: [
        { _id: new ObjectId(id) },
        { id: id }
      ]
    })
    if (!blog) return null
    
    return {
      ...blog,
      id: blog._id?.toString() || blog.id,
      _id: undefined
    } as Blog
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    return fallbackBlogsStorage.find(blog => blog.id === id) || null
  }
}

async function createBlog(blogData: Omit<Blog, '_id'>): Promise<Blog> {
  if (!USE_MONGODB) {
    const newBlog = { ...blogData } as Blog
    fallbackBlogsStorage.push(newBlog)
    return newBlog
  }
  
  try {
    const collection = await getBlogsCollection()
    const result = await collection.insertOne(blogData)
    
    return {
      ...blogData,
      id: result.insertedId.toString(),
      _id: undefined
    } as Blog
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    const newBlog = { ...blogData } as Blog
    fallbackBlogsStorage.push(newBlog)
    return newBlog
  }
}

async function updateBlog(id: string, updateData: Partial<Blog>): Promise<Blog | null> {
  if (!USE_MONGODB) {
    const blogIndex = fallbackBlogsStorage.findIndex(blog => blog.id === id)
    if (blogIndex === -1) return null
    
    fallbackBlogsStorage[blogIndex] = {
      ...fallbackBlogsStorage[blogIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return fallbackBlogsStorage[blogIndex]
  }
  
  try {
    const collection = await getBlogsCollection()
    const { _id, id: blogId, ...updateFields } = updateData
    
    const result = await collection.findOneAndUpdate(
      { 
        $or: [
          { _id: new ObjectId(id) },
          { id: id }
        ]
      },
      { $set: { ...updateFields, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    )
    
    if (!result || !result.value) return null
    
    return {
      ...result.value,
      id: result.value._id?.toString() || result.value.id,
      _id: undefined
    } as Blog
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    const blogIndex = fallbackBlogsStorage.findIndex(blog => blog.id === id)
    if (blogIndex === -1) return null
    
    fallbackBlogsStorage[blogIndex] = {
      ...fallbackBlogsStorage[blogIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return fallbackBlogsStorage[blogIndex]
  }
}

async function deleteBlog(id: string): Promise<boolean> {
  if (!USE_MONGODB) {
    const blogIndex = fallbackBlogsStorage.findIndex(blog => blog.id === id)
    if (blogIndex === -1) return false
    
    fallbackBlogsStorage.splice(blogIndex, 1)
    return true
  }
  
  try {
    const collection = await getBlogsCollection()
    const result = await collection.deleteOne({
      $or: [
        { _id: new ObjectId(id) },
        { id: id }
      ]
    })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('MongoDB error, falling back to in-memory storage:', error)
    const blogIndex = fallbackBlogsStorage.findIndex(blog => blog.id === id)
    if (blogIndex === -1) return false
    
    fallbackBlogsStorage.splice(blogIndex, 1)
    return true
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        return handleGetBlogs(req, res)
      case 'POST':
        return handleCreateBlog(req, res)
      case 'PUT':
        return handleUpdateBlog(req, res)
      case 'DELETE':
        return handleDeleteBlog(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('Blog API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    })
  }
}

async function handleGetBlogs(req: NextApiRequest, res: NextApiResponse) {
  const { status, category, limit, offset, slug } = req.query

  try {
    // Filter by slug (for single blog)
    if (slug) {
      const blog = await getBlogBySlug(slug as string)
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      
      // Increment view count
      const updatedBlog = await updateBlog(blog.id, {
        views: (blog.views || 0) + 1
      })
      
      return res.status(200).json({ 
        success: true,
        data: { blog: updatedBlog || blog }
      })
    }

    // Get all blogs from MongoDB
    const collection = await getBlogsCollection()
    
    // Build query filters
    const filters: any = {}
    
    if (status && status !== 'all') {
      filters.status = status
    }
    
    if (category && category !== 'all') {
      filters.category = category
    }

    // Get total count for pagination
    const total = await collection.countDocuments(filters)
    
    // Pagination
    const limitNum = parseInt(limit as string) || 10
    const offsetNum = parseInt(offset as string) || 0
    
    // Get blogs with filters, sorting, and pagination
    const blogs = await collection
      .find(filters)
      .sort({ publishDate: -1 }) // Sort by publish date (newest first)
      .skip(offsetNum)
      .limit(limitNum)
      .toArray()
    
    // Transform blogs to remove MongoDB _id and add string id
    const transformedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id?.toString() || blog.id,
      _id: undefined
    })) as Blog[]

    return res.status(200).json({
      success: true,
      data: {
        blogs: transformedBlogs,
        total: total,
        limit: limitNum,
        offset: offsetNum
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return res.status(500).json({
      error: 'Failed to fetch blogs',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    })
  }
}

async function handleCreateBlog(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    content,
    category,
    status = 'draft',
    tags = [],
    author,
    publishDate,
    seoTitle,
    seoDescription,
    featuredImage
  } = req.body

  if (!title || !content || !category || !author) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['title', 'content', 'category', 'author']
    })
  }

  try {
    const slug = generateSlug(title)
    
    // Check if slug already exists in MongoDB
    const existingBlog = await getBlogBySlug(slug)
    if (existingBlog) {
      return res.status(400).json({
        error: 'A blog with this title already exists',
        suggestion: 'Please choose a different title'
      })
    }

    const newBlogData: Omit<Blog, '_id'> = {
      id: crypto.randomUUID(),
      title,
      content,
      excerpt: generateExcerpt(content),
      slug,
      category,
      status,
      tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
      author,
      publishDate: publishDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || generateExcerpt(content),
      featuredImage,
      views: 0
    }

    const newBlog = await createBlog(newBlogData)

    return res.status(201).json({
      success: true,
      data: { blog: newBlog },
      message: 'Blog created successfully'
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    return res.status(500).json({
      error: 'Failed to create blog',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    })
  }
}

async function handleUpdateBlog(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const updateData = req.body

  if (!id) {
    return res.status(400).json({ error: 'Blog ID is required' })
  }

  try {
    // Get existing blog
    const existingBlog = await getBlogById(id as string)
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== existingBlog.title) {
      const newSlug = generateSlug(updateData.title)
      
      // Check if new slug already exists (for different blog)
      const blogWithSlug = await getBlogBySlug(newSlug)
      if (blogWithSlug && blogWithSlug.id !== id) {
        return res.status(400).json({
          error: 'A blog with this title already exists',
          suggestion: 'Please choose a different title'
        })
      }
      
      updateData.slug = newSlug
    }

    // Update excerpt if content changed
    if (updateData.content) {
      updateData.excerpt = generateExcerpt(updateData.content)
    }

    // Update SEO fields if not provided
    if (updateData.title && !updateData.seoTitle) {
      updateData.seoTitle = updateData.title
    }
    if (updateData.content && !updateData.seoDescription) {
      updateData.seoDescription = generateExcerpt(updateData.content)
    }

    const updatedBlog = await updateBlog(id as string, updateData)
    
    if (!updatedBlog) {
      return res.status(500).json({ error: 'Failed to update blog' })
    }

    return res.status(200).json({
      success: true,
      data: { blog: updatedBlog },
      message: 'Blog updated successfully'
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return res.status(500).json({
      error: 'Failed to update blog',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    })
  }
}

async function handleDeleteBlog(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Blog ID is required' })
  }

  try {
    // Get the blog before deleting it
    const existingBlog = await getBlogById(id as string)
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Delete the blog from MongoDB
    const deleted = await deleteBlog(id as string)
    
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete blog' })
    }

    return res.status(200).json({
      success: true,
      data: { blog: existingBlog },
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return res.status(500).json({
      error: 'Failed to delete blog',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    })
  }
}
