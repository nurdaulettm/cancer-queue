# 🌐 PUBLIC ACCESS - GET YOUR LINK NOW

## 🚀 Option 1: Use Docker (Fastest)

The TrueBeam Queue Management System is ready to deploy. Here's the easiest way to make it public:

### Quick Deploy (Choose One):

#### A. Deploy to Render.com (Free, 5 minutes)
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo with Queue_Can
5. Set:
   - Build Command: `npm install && pip install -r backend/requirements.txt`
   - Start Command: `npm run build && npm start`
   - Environment: `NODE_ENV=production`
6. Deploy!
7. Get your public URL: `https://your-app.onrender.com`

#### B. Deploy to Railway (Very Easy)
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub"
4. Choose your Queue_Can repo
5. Select root directory
6. Done! Railway handles everything
7. Get your public URL automatically

#### C. Deploy to Vercel (Frontend Only)
1. Go to: https://vercel.com
2. Import your frontend repo
3. Set environment variables
4. Click Deploy
5. Instant public URL!

---

## 🔗 Option 2: Get Instant Public Link (Right Now!)

### Using LocalTunnel (No Installation):

```bash
# Make sure you're in the Queue_Can directory
cd C:\Users\tasmu\Queue_Can

# Start backend
cd backend && npm start  # or python main.py

# In another terminal, start frontend
cd frontend && npm start  # or npm run dev

# In third terminal, expose it
npx localtunnel --port 3000

# You'll get a URL like:
# Your url is: https://quiet-moon-12345.loca.lt
```

### Using Ngrok (Free, 5 minutes):

```bash
# Step 1: Download Ngrok
# https://ngrok.com/download
# Or run:
# choco install ngrok  (if you have Chocolatey)

# Step 2: Get free account and token
# https://ngrok.com/signup

# Step 3: Run (after starting frontend on port 3000)
ngrok http 3000

# You get instant public URL!
```

---

## 📱 Option 3: Mobile & Remote Access

### Your Current Local URLs:
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

### How to Share:

**Same Network (Home/Office)**:
- Use your IP: `http://192.168.x.x:3000`
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

**Different Network (Anywhere)**:
- Use ngrok or localtunnel (see above)
- Or deploy to cloud (Render, Railway, Vercel)

---

## ⚡ ONE-LINE PUBLIC ACCESS

### Using NPX (No Installation):

```bash
# After starting your frontend on port 3000, run:
npx localtunnel --port 3000

# Instant public URL!
```

Or:

```bash
# Using Ngrok (requires free account)
npx ngrok http 3000
```

---

## 📊 COMPARISON TABLE

| Method | Setup | Cost | Latency | Permanent | Best For |
|--------|-------|------|---------|-----------|----------|
| **Ngrok** | 5 min | Free/Paid | Low | No* | Testing |
| **LocalTunnel** | 1 min | Free | Low | No | Quick demos |
| **Render** | 10 min | Free/Paid | Medium | Yes | Production |
| **Railway** | 10 min | Free/Paid | Medium | Yes | Production |
| **Vercel** | 5 min | Free/Paid | Very Low | Yes | Frontend only |
| **Heroku** | 10 min | Paid | Medium | Yes | Full stack |

*Ngrok free tier: URL changes on restart

---

## 🎯 RECOMMENDED FLOW

### For Quick Demo (Right Now):
```bash
# 1. Start services
cd backend && python main.py  # Terminal 1
cd frontend && npm run dev    # Terminal 2

# 2. Get public link
npx localtunnel --port 3000  # Terminal 3

# Share the URL!
```

### For Permanent Deployment:
```bash
# 1. Push to GitHub
git add .
git commit -m "Queue management system"
git push

# 2. Deploy to Render/Railway
# Connect your GitHub repo
# Done!
```

---

## ✅ WHAT YOU'LL GET

Public URL like:
```
https://quiet-moon-12345.loca.lt
or
https://truebeam-queue.onrender.com
```

Access to:
- ✅ Dashboard with real-time metrics
- ✅ Strategy sandbox with simulations
- ✅ Full API (if exposed)
- ✅ Works on mobile & tablets
- ✅ Shareable link

---

## 🔒 SECURITY

- ✅ HTTPS (encrypted)
- ✅ Your localhost not exposed
- ✅ Temporary URL (can disable)
- ✅ No personal data at risk
- ⚠️ Don't share in public channels
- ⚠️ Not for production yet (add auth)

---

## 🆘 QUICK HELP

### I want a public link RIGHT NOW:
```bash
npm install -g localtunnel
# Start your frontend (npm run dev)
lt --port 3000 --subdomain truebeam-queue
```

### I want a permanent URL:
→ Deploy to Render.com or Railway.app

### I want to be offline but still accessible:
→ Deploy to cloud provider

### I want custom domain:
→ Use ngrok paid ($5/month) or Railway/Render

---

## 📞 QUICK START COMMANDS

### LocalTunnel (Easiest)
```bash
npx localtunnel --port 3000
```

### Ngrok (Fastest)
```bash
ngrok http 3000
```

### Render.com (Most Reliable)
```bash
# Visit: https://render.com
# Connect GitHub → Deploy
```

---

## NEXT STEPS

1. **Choose method above** (LocalTunnel recommended for now)
2. **Start your services**:
   ```bash
   cd backend && python main.py
   cd frontend && npm run dev
   ```
3. **Get public URL** (using your chosen method)
4. **Share the URL**!

---

**That's it! You're now public! 🎉**

Want help? See PUBLIC_ACCESS.md in full
