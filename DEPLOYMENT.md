# 🚀 Deployment Guide - Make My Knot

This guide provides instructions for deploying Make My Knot to production environments.

## 📋 Pre-deployment Checklist

### ✅ Environment Setup
- [ ] MongoDB Atlas cluster configured and accessible
- [ ] Environment variables configured (see `.env.example`)
- [ ] SSL certificates ready (automatic with most platforms)
- [ ] Domain name configured (optional)

### ✅ Code Preparation
- [ ] All authentication functions re-enabled
- [ ] Migration scripts tested
- [ ] Database connections verified
- [ ] Build process tested locally

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [Recommended]

#### **Frontend Deployment (Vercel)**

1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     ```env
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
     NODE_ENV=production
     ```

3. **Custom Domain (Optional)**
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed

#### **Backend Deployment (Railway)**

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select the `makemyknot-backend` folder

2. **Environment Variables**
   ```env
   PORT=4000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=https://your-vercel-domain.vercel.app
   ```

3. **Deploy**
   - Railway automatically builds and deploys
   - Note the generated URL for frontend configuration

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### **Frontend Deployment (Netlify)**

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NEXT_PUBLIC_API_URL = "https://your-heroku-app.herokuapp.com/api"
   ```

2. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy automatically on push

#### **Backend Deployment (Heroku)**

1. **Heroku Setup**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login and create app
   heroku login
   heroku create your-app-name
   ```

2. **Configure Environment**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   heroku config:set CLIENT_URL=https://your-netlify-domain.netlify.app
   ```

3. **Deploy**
   ```bash
   # From makemyknot-backend directory
   git subtree push --prefix=makemyknot-backend heroku main
   ```

## 🔧 Production Configuration

### **Frontend Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NODE_ENV=production
```

### **Backend Environment Variables**
```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/makemyknot
JWT_SECRET=super-secure-production-secret-key
CLIENT_URL=https://your-frontend-domain.com
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Security Considerations

### **Production Security Checklist**
- [ ] Strong JWT secrets (32+ characters)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Database access restricted to application
- [ ] No sensitive data in client-side code

### **MongoDB Security**
- [ ] IP whitelist configured
- [ ] Strong database password
- [ ] Connection string secured in environment variables
- [ ] Database user has minimal required permissions

## 📊 Monitoring & Analytics

### **Recommended Monitoring Tools**
- **Vercel Analytics** - Frontend performance
- **Railway Metrics** - Backend performance  
- **MongoDB Atlas Monitoring** - Database metrics
- **Sentry** - Error tracking
- **Google Analytics** - User analytics

### **Health Check Endpoints**
- Frontend: `https://your-domain.com/api/health`
- Backend: `https://your-backend.com/api/health`

## 🚀 Migration to Production

### **Data Migration Process**
1. **Backup existing data**
   ```bash
   # Use the migration page at /admin/migration
   # Or run migration scripts manually
   ```

2. **Test with production database**
   - Run migration scripts
   - Verify data integrity
   - Test authentication flows

3. **Switch DNS/domains**
   - Update domain pointing
   - Test all functionality
   - Monitor for issues

## 🔄 CI/CD Pipeline (Optional)

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway/action@v1
```

## 📞 Support & Troubleshooting

### **Common Issues**
- **CORS Errors**: Check CLIENT_URL environment variable
- **Database Connection**: Verify MongoDB connection string
- **Build Failures**: Check Node.js version compatibility
- **Environment Variables**: Ensure all required vars are set

### **Getting Help**
- Check logs in your deployment platform
- Use health check endpoints for debugging
- Monitor MongoDB Atlas for database issues
- Review Vercel/Railway deployment logs

---

**🎉 Congratulations! Your Make My Knot platform is ready for production deployment!**
