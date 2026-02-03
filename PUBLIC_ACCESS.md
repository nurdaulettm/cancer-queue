# 🌐 Making TrueBeam Queue PUBLIC - Complete Guide

## Option 1: Using Ngrok (Easiest)

### Step 1: Install Ngrok
```bash
# Download from: https://ngrok.com/download
# Or use this command:
curl https://ngrok-agent.s3.amazonaws.com/ngrok-stable-windows-amd64.zip -o ngrok.zip
Expand-Archive ngrok.zip -DestinationPath C:\tools\ngrok
setx PATH "%PATH%;C:\tools\ngrok"
```

### Step 2: Create Free Ngrok Account
1. Visit: https://ngrok.com/
2. Sign up for free account
3. Get your authtoken from: https://dashboard.ngrok.com/auth

### Step 3: Authenticate Ngrok
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Step 4: Start Services
**Terminal 1:**
```bash
cd backend
python main.py
# Should show: Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2:**
```bash
cd frontend
npm run dev
# Should show: - Local: http://localhost:3000
```

**Terminal 3:**
```bash
ngrok http 3000
# This will show your PUBLIC URL!
# Example: https://abc123-45-67-89.ngrok.io
```

### Your Public Link
When ngrok runs, you'll see:
```
ngrok by @inconshreveable

Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-45-67-89.ngrok.io -> http://localhost:3000

Your app is now PUBLIC at: https://abc123-45-67-89.ngrok.io
```

---

## Option 2: Using Cloudflare Tunnel

### Step 1: Install Cloudflare Warp
1. Download: https://1.1.1.1/
2. Install and open the application
3. Enable Warp

### Step 2: Install Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
scoop install cloudflare-warp  # or choco install cloudflare-warp
```

### Step 3: Authenticate
```bash
cloudflare-warp login
```

### Step 4: Create Tunnel
```bash
cloudflare-warp tunnel create my-queue-app
cloudflare-warp tunnel route dns my-queue-app localhost 3000
cloudflare-warp tunnel run my-queue-app
```

Your URL: `https://my-queue-app.cfargotunnel.com`

---

## Option 3: Using LocalTunnel (Simplest)

### Step 1: Install LocalTunnel
```bash
npm install -g localtunnel
```

### Step 2: Expose Your App
After frontend is running on port 3000:
```bash
lt --port 3000 --subdomain truebeam-queue
```

Your URL: `https://truebeam-queue.loca.lt`

---

## Option 4: Using Exposer (Alternative)

```bash
# Install
npm install -g exposer

# Expose
exposer http://localhost:3000
```

---

## Option 5: Manual Cloud Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create my-truebeam-queue

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend Only)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

### Deploy to Railway
```bash
# Visit: https://railway.app
# Connect your GitHub
# Deploy with one click
```

---

## Quick Start (Using Ngrok - Recommended)

### All-in-One Script
```bash
REM Windows: Save as start-public.bat
@echo off
echo Starting Backend...
start "Backend" python -C "cd backend && python main.py"

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5

echo Starting Ngrok...
ngrok http 3000

pause
```

### Linux/macOS
```bash
#!/bin/bash

# Start backend
cd backend && python main.py &
sleep 2

# Start frontend
cd frontend && npm run dev &
sleep 3

# Start ngrok
ngrok http 3000
```

---

## What You Get

### Local Access
- Dashboard: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Public Access (Ngrok Example)
- Dashboard: https://abc123-45-67-89.ngrok.io
- API: https://abc123-45-67-89.ngrok.io/api/*

### Features Available
- ✅ Real-time metrics
- ✅ Strategy simulations
- ✅ Full API access
- ✅ Interactive dashboard
- ✅ Charts and analytics

---

## Ngrok Tips & Tricks

### View Dashboard
```bash
# Ngrok provides a local dashboard
http://127.0.0.1:4040
# Shows all traffic through your tunnel
```

### Share Your URL
```bash
# Copy this URL and share
# https://abc123-45-67-89.ngrok.io
```

### Ngrok Pro Benefits (Paid)
- Custom domain names
- Static URLs (don't change on restart)
- Higher traffic limits
- More customization

### Free Ngrok Limitations
- URL changes on restart
- Limited bandwidth
- Limited connections
- 1 tunnel at a time

---

## Troubleshooting

### "ngrok: command not found"
```bash
# Add to PATH
setx PATH "%PATH%;C:\tools\ngrok"  # Windows
export PATH="$PATH:$(pwd)" # macOS/Linux
```

### "Port 3000 in use"
```bash
# Find and kill process
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### "Backend won't start"
```bash
# Make sure Python is installed
python --version

# Install dependencies
cd backend
pip install -r requirements.txt
```

### "Frontend won't start"
```bash
# Make sure Node.js is installed
node --version

# Install dependencies
cd frontend
npm install
```

### Ngrok URL not working
```bash
# Make sure services are running on correct ports
# Backend: 8000
# Frontend: 3000

# Test locally first
curl http://localhost:3000
```

---

## Performance Notes

- **Ngrok Free**: Good for testing, demos, sharing
- **Ngrok Pro**: Better for production use
- **Cloudflare Tunnel**: Great for always-on services
- **Vercel/Railway**: Best for permanent deployments

---

## Security Notes

⚠️ **For Testing Only**: Public access means anyone can access
- Don't share URLs in public channels
- Add authentication before production
- Use HTTPS (ngrok provides this)
- Monitor who accesses your system

---

## Next Steps

1. Choose an option above (Ngrok recommended)
2. Follow the setup steps
3. Get your public URL
4. Share it with others
5. Monitor usage via dashboard

---

## Example Commands (Copy & Paste)

### Full Setup with Ngrok
```bash
# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Public Tunnel
ngrok http 3000
# 👆 This gives you the public URL!
```

### Using LocalTunnel (Simpler)
```bash
# Install once
npm install -g localtunnel

# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Make public
lt --port 3000 --subdomain truebeam-queue
```

---

## Getting Your Link

1. Run the frontend: `npm run dev` (port 3000)
2. Create tunnel: `ngrok http 3000`
3. Copy the URL: `https://xxxxx-xxxxx-xxxxx.ngrok.io`
4. Share that URL!

---

**Questions?** Check the appropriate section above or see QUICKSTART.md.

**Ready?** Pick an option and follow the steps!
