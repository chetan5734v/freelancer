# PowerShell deployment script for Windows

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install --production

# Start backend server in background
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Hidden

# Return to root directory
Set-Location ..

# Serve frontend
Write-Host "🚀 Serving frontend..." -ForegroundColor Yellow
npx serve -s build -l 3000

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8002" -ForegroundColor Cyan
