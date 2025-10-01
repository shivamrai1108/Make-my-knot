# MongoDB Setup Guide for Make My Knot

## Problem Fixed 🔧

Previously, the blog system used **in-memory storage** which meant all blog data disappeared when the server restarted. Now the system uses **MongoDB for persistent storage** with automatic fallback to in-memory storage if MongoDB is not configured.

## Quick Setup (5 minutes)

### Option 1: MongoDB Atlas (Recommended - Free)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (M0 free tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" driver
   - Copy the connection string

3. **Configure Environment Variables**
   ```bash
   # Copy example file
   cp .env.example .env.local
   
   # Edit .env.local and add your MongoDB URI:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/makemyknot
   MONGODB_DB=makemyknot
   ```

4. **Replace credentials in URI**
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/makemyknot
   ```

### Option 2: Local MongoDB

1. **Install MongoDB locally**
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb-community
   ```

2. **Configure Environment**
   ```bash
   # In .env.local
   MONGODB_URI=mongodb://localhost:27017/makemyknot
   MONGODB_DB=makemyknot
   ```

## Features Enabled ✨

With MongoDB configured, you get:

- ✅ **Persistent Blog Storage** - Blogs survive server restarts
- ✅ **Advanced Querying** - Filter by status, category, pagination
- ✅ **View Counting** - Track blog post views
- ✅ **Slug Management** - Automatic URL-friendly slugs
- ✅ **SEO Optimization** - Auto-generated excerpts and metadata
- ✅ **Rich Content** - Full HTML content with images
- ✅ **Production Ready** - Scalable database solution

## How It Works 🧠

### Storage Strategy
```
MongoDB Available?
├─ YES → Use MongoDB (persistent storage)
└─ NO  → Use in-memory storage (temporary)
```

### Database Schema
```javascript
{
  _id: ObjectId("..."),
  id: "uuid-string",
  title: "Blog Post Title",
  content: "<p>Rich HTML content...</p>",
  excerpt: "Auto-generated summary...",
  slug: "blog-post-title",
  category: "Advice",
  status: "published", // draft | published | archived
  tags: ["relationship", "marriage"],
  author: "Author Name",
  publishDate: "2025-01-01T00:00:00.000Z",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  seoTitle: "Custom SEO title",
  seoDescription: "Custom SEO description",
  featuredImage: "https://example.com/image.jpg",
  views: 42
}
```

## Verification 🔍

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Check console output**
   - ✅ With MongoDB: `🍃 Blog system using MongoDB for persistent storage`
   - ⚠️ Without MongoDB: `⚠️ Blog system using in-memory storage`

3. **Test blog creation**
   - Go to `http://localhost:3000/admin`
   - Create a blog post
   - Restart the server
   - Blog should still be there (if MongoDB configured)

## Troubleshooting 🔧

### Connection Issues
- Verify your MongoDB URI is correct
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

### Common Errors
```bash
# Error: "Please add your Mongo URI to .env.local"
# Solution: Add MONGODB_URI to your .env.local file

# Error: "MongoNetworkError"
# Solution: Check your internet connection and MongoDB Atlas settings
```

### Fallback Mode
If MongoDB fails, the system automatically falls back to in-memory storage. You'll see this warning:
```
⚠️ Blog system using in-memory storage (data will be lost on restart)
   Add MONGODB_URI to .env.local for persistent storage
```

## Production Deployment 🚀

For production environments:

1. **MongoDB Atlas Production Cluster**
   - Use M2+ tier for production workloads
   - Enable backup
   - Configure proper security settings

2. **Environment Variables**
   ```bash
   # Production .env
   MONGODB_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/makemyknot
   MONGODB_DB=makemyknot
   NODE_ENV=production
   ```

3. **Security Best Practices**
   - Use strong passwords
   - Limit IP access
   - Enable authentication
   - Use connection string encryption

## Migration from In-Memory ⚡

If you have existing blogs in memory that you want to preserve:

1. Export existing blogs before restart
2. Set up MongoDB
3. Manually recreate important blogs
4. Future blogs will be automatically saved

---

**Status**: ✅ MongoDB integration complete - persistent blog storage enabled!