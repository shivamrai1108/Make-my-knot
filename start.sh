#!/bin/bash
echo "🚀 Starting MakeMyKnot Backend API Server..."
echo "📍 Root Directory: $(pwd)"
echo "📂 Changing to backend directory..."
cd makemyknot-backend
echo "📍 Backend Directory: $(pwd)"
echo "📋 Files in backend directory:"
ls -la
echo "🔧 Starting Node.js backend server..."
exec node src/index.js
