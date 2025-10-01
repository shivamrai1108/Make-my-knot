#!/bin/bash
echo "🚀 Starting MakeMyKnot Backend API Server..."
echo "📍 Working Directory: $(pwd)"
echo "📋 Files in directory:"
ls -la
echo "🔧 Starting Node.js backend server..."
exec node src/index.js