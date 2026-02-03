# 🌍 TrueBeam Queue - PUBLIC ACCESS GUIDE

## 📍 YOUR ENTRY POINTS

### 🏠 **Local Access** (Right Now)
After setup, access locally:
```
Dashboard:  http://localhost:3000
API:        http://localhost:8000
API Docs:   http://localhost:8000/docs
```

---

## 🌐 **MAKE IT PUBLIC (3 Options)**

### ⚡ **FASTEST: LocalTunnel (1 command)**

```bash
# After frontend is running on port 3000:
npx localtunnel --port 3000 --subdomain truebeam-queue

# You get instant public link:
# https://truebeam-queue.loca.lt
```

**Pros**: One command, instant, free
**Cons**: URL resets on restart, temporary

---

### 🚀 **BEST: ngrok (Professional)**

```bash
# 1. Sign up free: https://ngrok.com
# 2. Download & install ngrok
# 3. Authenticate: ngrok config add-authtoken YOUR_TOKEN
# 4. Expose: ngrok http 3000

# Public URL:
# https://xxxx-xxxx-xxxx.ngrok.io
```

**Pros**: Industry standard, reliable, free tier available
**Cons**: Requires account, free tier URL changes on restart

---

### 💻 **PERMANENT: Deploy to Cloud**

#### Render.com (Recommended)
```
1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Connect Queue_Can repo
5. Deploy!
6. Get permanent URL: https://your-app.onrender.com
```

#### Railway.app
```
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Connect repo
5. Auto-deployed!
6. Get permanent URL
```

#### Vercel (Frontend)
```
1. Go to https://vercel.com
2. Import frontend
3. Deploy
4. Instant public URL
```

---

## 📝 **QUICK START (Choose One)**

### **Option A: Public in 30 seconds**
```bash
cd C:\Users\tasmu\Queue_Can
npm install -g localtunnel
# Start services (see below)
lt --port 3000
# Copy the URL and share!
```

### **Option B: Professional setup**
```bash
# Get ngrok
# Then run: ngrok http 3000
```

### **Option C: Permanent deployment**
```bash
# Push to GitHub
# Deploy to Render/Railway
# Get permanent URL
```

---

## 🚀 **STARTUP SEQUENCE**

### Terminal 1: Backend
```bash
cd backend
python main.py
# Wait for: "Uvicorn running on http://0.0.0.0:8000"
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Wait for: "- Local: http://localhost:3000"
```

### Terminal 3: Public Access
```bash
# Choose one:

# Option A - Instant:
npx localtunnel --port 3000

# Option B - Professional:
ngrok http 3000

# Option C - Permanent:
# Deploy to Render/Railway/Vercel
```

---

## 📊 **WHAT YOU GET**

### Local (http://localhost:3000)
✅ Full access
✅ Real-time updates
✅ All features
✅ No latency
✅ Offline capable

### Public (ngrok/localtunnel)
✅ Share with others
✅ Remote access
✅ Works on any device
✅ Same features as local
✅ HTTPS encrypted

---

## 🔗 **EXAMPLE URLS**

### LocalTunnel
```
https://quiet-moon-12345.loca.lt
https://truebeam-queue.loca.lt
```

### Ngrok
```
https://abc123-45-67-89.ngrok.io
https://d8c4-203-0-113-43.ngrok.io
```

### Deployed
```
https://truebeam-queue.onrender.com
https://queue-app.railway.app
https://queue-system.vercel.app
```

---

## ⏱️ **TIME TO PUBLIC**

| Method | Time | Permanent |
|--------|------|-----------|
| LocalTunnel | 1 min | No |
| Ngrok | 5 min | No* |
| Render | 10 min | Yes |
| Railway | 10 min | Yes |
| Vercel | 5 min | Yes |

*Ngrok free has temporary URLs, pro has permanent

---

## 🎯 **RECOMMENDATIONS**

### **Quick Demo?**
→ Use LocalTunnel (1 command!)

### **Want Professional?**
→ Use Ngrok (free account)

### **Need Permanent?**
→ Deploy to Render/Railway

### **Frontend Only?**
→ Deploy to Vercel

### **Full Production?**
→ Docker + cloud provider

---

## 📱 **NETWORK ACCESS**

### **Same Network (Home/Office)**
Get your IP:
```bash
# Windows
ipconfig
# Find: IPv4 Address: 192.168.x.x

# Mac/Linux
ifconfig
# Find: inet 192.168.x.x
```

Access from any device:
```
http://192.168.x.x:3000
```

### **Different Network**
Use ngrok or deploy to cloud

---

## 🔒 **SECURITY TIPS**

✅ All methods use HTTPS
✅ Your computer not exposed
✅ Temporary URLs can be disabled
✅ Only share URL with trusted people
⚠️ Don't share in public forums
⚠️ Add authentication before production

---

## 💡 **ADVANCED OPTIONS**

### **Custom Domain**
```bash
# Ngrok Pro ($5/month)
ngrok http 3000 --domain=truebeam-queue.ngrok.io

# Or deploy to cloud with custom domain
```

### **Multiple Services**
```bash
# Expose both frontend & backend
ngrok http -config=ngrok.yml 3000 8000
```

### **Always-On**
```bash
# Deploy to cloud for 24/7 access
# Render, Railway, or AWS
```

---

## ❓ **FAQ**

**Q: What's the easiest way to share?**
A: `npx localtunnel --port 3000` (1 command!)

**Q: Will the URL work forever?**
A: No (unless deployed to cloud)

**Q: Can I access from mobile?**
A: Yes! Works on any device with internet

**Q: Is it secure?**
A: Yes, all methods use HTTPS

**Q: What if I want a custom domain?**
A: Use ngrok Pro or deploy to cloud

**Q: Can multiple people access at once?**
A: Yes! Unlimited simultaneous users

**Q: What if port 3000 is in use?**
A: Use different port: `npm run dev -- -p 3001`

---

## 🚀 **DO THIS NOW**

1. Start backend: `cd backend && python main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Run: `npx localtunnel --port 3000`
4. Copy the URL
5. Share it!

**That's it! You're public!** 🎉

---

## 📞 **NEED HELP?**

See detailed guides:
- **PUBLIC_ACCESS.md** - All methods explained
- **GET_PUBLIC_LINK.md** - Quick reference
- **QUICKSTART.md** - Getting started
- **INSTALLATION.md** - Setup help

---

**Ready to go public? Pick a method above and get your link!** 🌐
