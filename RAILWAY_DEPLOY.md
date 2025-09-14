# 🚀 Railway Backend Deployment Guide

Your frontend is live at: **https://make-my-knot-kappa.vercel.app/**

Now let's deploy the backend to Railway for full functionality.

## Quick Deploy to Railway

### 1. Go to Railway.app
- Visit [railway.app](https://railway.app)
- Sign up/login with your GitHub account

### 2. Deploy from GitHub
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Select your repository: `shivamrai1108/Make-my-knot`
- Select the `makemyknot-backend` directory as root

### 3. Set Environment Variables
Add these environment variables in Railway dashboard:

```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://Useradmin:Play%40123Dehradun@makemyknot.rlnjjl7.mongodb.net/makemyknot?retryWrites=true&w=majority&appName=Makemyknot
JWT_SECRET=super-secret-jwt-key-for-makemyknot-production
CLIENT_URL=https://make-my-knot-kappa.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### 4. Deploy
- Railway will automatically build and deploy
- Note the generated URL (e.g., `https://your-app-name.railway.app`)

### 5. Update Frontend Environment
Once backend is deployed, update your Vercel environment variables:
- Go to Vercel dashboard
- Add environment variable: `NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api`

## Alternative: Deploy via CLI

If you prefer command line:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from makemyknot-backend directory
cd makemyknot-backend
railway deploy
```

## Test Deployment
Once deployed, test these endpoints:
- Health check: `https://your-railway-app.railway.app/api/health`
- Migration status: `https://your-railway-app.railway.app/api/migration/status`

## What's Next?
After backend deployment:
1. ✅ Frontend live: https://make-my-knot-kappa.vercel.app/
2. ✅ Backend live: https://your-railway-app.railway.app/
3. 📱 Full platform functionality active
4. 🔄 Run data migration via: https://make-my-knot-kappa.vercel.app/admin/migration
