#!/bin/bash

# Production deployment script

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Start backend server
echo "🚀 Starting backend server..."
npm start &

# Serve frontend
echo "🚀 Serving frontend..."
cd ..
npx serve -s build -l 3000

echo "✅ Deployment complete!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8002"
