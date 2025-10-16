#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting MakeMyKnot Backend API Server..."
echo "📍 Running from: $(pwd)"

# Move to backend directory (repo structure uses makemyknot-backend)
if [ -d "makemyknot-backend" ]; then
  echo "📂 Changing to backend directory..."
  cd makemyknot-backend
else
  echo "⚠️ Directory makemyknot-backend not found; assuming current dir is backend"
fi

echo "📍 Backend Directory: $(pwd)"
echo "📋 Files in backend directory:"
ls -la

# Use platform-provided PORT if available
PORT="${PORT:-3000}"
echo "🔌 Using PORT=$PORT (platform-supplied if available)"

# Safety fallback: install production deps if node_modules missing
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules missing — running npm ci --only=production (this may take a moment)"
  npm ci --only=production
fi

echo "🔧 Starting Node.js backend server..."
# exec replaces the shell with the node process (good signal handling)
exec node src/index.js
