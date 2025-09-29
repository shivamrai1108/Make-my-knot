#!/bin/bash

echo "🔧 Fix Railway Deployment - Make My Knot Backend"
echo "==============================================="

cd "$(dirname "$0")/makemyknot-backend" || {
    echo "❌ Could not find makemyknot-backend directory"
    exit 1
}

echo "📁 Current directory: $(pwd)"

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "🔗 Linking to your existing Railway project..."
echo "When prompted, select your existing project: Make My Knot Backend"

# Connect to the existing project
railway login

echo ""
echo "🎯 Connecting to your project..."
echo "Use project ID: 0a7b2e49-3fd6-427c-9a7f-ea9224f92d6d"
echo "Service ID: 38a13c88-f52f-48f2-9d4c-8c9db5526e5f"

# Link to the existing project
railway link

echo ""
echo "🌍 Setting up environment variables..."
echo "Setting essential environment variables for your Railway project..."

railway variables set PORT=4000
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://Useradmin:Play%40123Dehradun@makemyknot.rlnjjl7.mongodb.net/makemyknot?retryWrites=true&w=majority&appName=Makemyknot"
railway variables set JWT_SECRET="super-secret-jwt-key-for-makemyknot-production"
railway variables set CLIENT_URL="https://makemyknot.com"
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
railway variables set BCRYPT_SALT_ROUNDS=12

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "📊 Getting deployment information..."
railway status

echo ""
echo "🌐 Getting your Railway app URL..."
RAILWAY_URL=$(railway domain 2>/dev/null || echo "Check Railway dashboard for URL")
echo "Your Railway URL should be: $RAILWAY_URL"

echo ""
echo "✅ Deployment Complete! Next steps:"
echo ""
echo "1. 🔍 Check your Railway dashboard: https://railway.com/project/0a7b2e49-3fd6-427c-9a7f-ea9224f92d6d"
echo "2. 📋 Copy your Railway app URL from the dashboard"
echo "3. 🌐 Update Vercel environment variables:"
echo "   - Go to your Vercel dashboard"
echo "   - Set NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api"
echo "   - Redeploy your frontend"
echo ""
echo "4. 🧪 Test your API endpoints:"
echo "   - Health check: https://YOUR-RAILWAY-URL.up.railway.app/api/health"
echo "   - Leads endpoint: https://YOUR-RAILWAY-URL.up.railway.app/api/leads/admin"
echo ""
echo "5. 📝 Test form submission on makemyknot.com"
echo ""
echo "🎉 Your backend should now be live and receiving data!"