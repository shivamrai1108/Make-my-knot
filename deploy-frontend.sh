#!/bin/bash

# Make My Knot - Frontend Deployment Script
echo "🚀 Deploying Make My Knot Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project locally first to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your custom domain (optional)"
echo "3. Update NEXT_PUBLIC_API_URL to point to your backend"
echo ""
echo "Environment variables to set in Vercel:"
echo "- NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api"
echo "- NODE_ENV=production"
