#!/bin/bash

echo "🚀 Make My Knot - Backend Deployment to Railway"
echo "==============================================="

# Check if we're in the right directory
if [ ! -d "makemyknot-backend" ]; then
    echo "❌ Error: makemyknot-backend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "1. ✅ Frontend is live at: https://makemyknot.com"
echo "2. 🔄 Backend deployment starting..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Login to Railway (this will open a browser)..."
railway login

echo "📁 Switching to backend directory..."
cd makemyknot-backend

echo "🎯 Creating new Railway project..."
railway project create --name makemyknot-backend

echo "🌍 Setting environment variables..."
echo "⚠️  You'll need to set these environment variables in Railway dashboard:"
echo ""
echo "PORT=4000"
echo "NODE_ENV=production" 
echo "MONGODB_URI=mongodb+srv://Useradmin:Play%40123Dehradun@makemyknot.rlnjjl7.mongodb.net/makemyknot?retryWrites=true&w=majority&appName=Makemyknot"
echo "JWT_SECRET=super-secret-jwt-key-for-makemyknot-production"
echo "CLIENT_URL=https://makemyknot.com"
echo "RATE_LIMIT_WINDOW_MS=900000"
echo "RATE_LIMIT_MAX_REQUESTS=100"
echo "BCRYPT_SALT_ROUNDS=12"
echo ""

read -p "Press Enter after you've added the environment variables in Railway dashboard..."

echo "🚀 Deploying to Railway..."
railway deploy

echo ""
echo "🎉 Deployment initiated! Next steps:"
echo "1. Wait for deployment to complete"
echo "2. Copy your Railway app URL"
echo "3. Update Vercel environment variable:"
echo "   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api"
echo "4. Test the API endpoints"
echo ""
echo "Railway app dashboard: https://railway.app/dashboard"