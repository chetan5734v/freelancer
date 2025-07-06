# Hosting Guide for Freelancing Platform

## Quick Start (Local Testing)

### Method 1: Using PowerShell Script
```powershell
.\deploy.ps1
```

### Method 2: Manual Setup
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Start backend
cd backend && npm start &

# Serve frontend
npx serve -s build -l 3000
```

## Production Hosting Options

### 1. Netlify (Frontend) + Heroku (Backend)

**Frontend (Netlify):**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard:
   - `REACT_APP_API_URL=https://your-backend-app.herokuapp.com`
   - `REACT_APP_SOCKET_URL=https://your-backend-app.herokuapp.com`

**Backend (Heroku):**
1. Create new Heroku app
2. Connect GitHub repository
3. Add environment variables:
   - `PORT=8002`
   - `FRONTEND_URL=https://your-app.netlify.app`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret`

### 2. Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Import project from GitHub
2. Framework preset: Create React App
3. Add environment variables:
   - `REACT_APP_API_URL=https://your-backend.railway.app`
   - `REACT_APP_SOCKET_URL=https://your-backend.railway.app`

**Backend (Railway):**
1. Deploy from GitHub
2. Add environment variables
3. Setup MongoDB database

### 3. Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build separately
docker build -t freelancing-frontend .
docker build -t freelancing-backend ./backend
```

### 4. VPS/Server Deployment

```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx

# Clone repository
git clone <your-repo>
cd freelancing-platform

# Install and build
npm install
npm run build

# Setup nginx
sudo cp nginx.conf /etc/nginx/sites-available/freelancing
sudo ln -s /etc/nginx/sites-available/freelancing /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Setup PM2 for backend
npm install -g pm2
cd backend
pm2 start server.js --name "freelancing-backend"
pm2 startup
pm2 save
```

## Environment Variables Setup

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

### Backend (.env)
```
PORT=8002
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb://your-mongodb-connection
JWT_SECRET=your-super-secret-jwt-key
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Add to backend environment variables

### Local MongoDB
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## SSL/HTTPS Setup

### Let's Encrypt (Free SSL)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Performance Optimization

1. **Enable gzip compression** in nginx
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Optimize images** and assets
5. **Use environment-specific builds**

## Monitoring & Logging

1. **Setup PM2** for process management
2. **Configure logging** for both frontend and backend
3. **Use monitoring tools** like New Relic, DataDog
4. **Setup error tracking** with Sentry

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Secure JWT secrets
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Set proper CORS policies
- [ ] Use environment variables for sensitive data
- [ ] Enable security headers
- [ ] Regular security updates

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check frontend/backend URLs in environment variables
2. **Socket connection fails**: Verify socket URL matches backend
3. **Build fails**: Check node version compatibility
4. **Database connection**: Verify MongoDB connection string

### Debug Commands:
```bash
# Check logs
pm2 logs
docker-compose logs

# Test API endpoints
curl https://your-backend-domain.com/api/test

# Check environment variables
printenv | grep REACT_APP
```
