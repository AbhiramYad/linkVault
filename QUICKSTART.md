# LinkVault Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Environment Variables

Both `.env.local` files are already created with your Supabase credentials:
- `backend/.env.local` 
- `frontend/.env.local`

No action needed - credentials are configured!

### Step 3: Start Services

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
LinkVault backend running on http://localhost:5000
✓ Database schema initialized successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### Step 4: Open in Browser

Go to `http://localhost:3000` and you're ready!

## 📝 First Time User Flow

1. **Sign Up** - Create account with email/password
2. **Create Link** - Click "+ Add Link"
   - Enter URL (metadata auto-fetches)
   - Add title, description, tags
   - Toggle Public/Private
   - Submit
3. **View Dashboard** - See all your links
4. **Check Analytics** - Click "Analytics" in navbar
5. **Share Public Link** - Copy URL from link card for public links

## 🐛 Troubleshooting

### Backend won't start
- Check port 5000 isn't in use: `netstat -an | grep 5000`
- Kill process: `lsof -ti :5000 | xargs kill -9`

### Frontend shows API errors
- Make sure backend is running on `http://localhost:5000`
- Check `.env.local` has correct `VITE_API_URL`

### Supabase connection fails
- Verify `.env.local` has correct credentials
- Check internet connection
- Log in to Supabase to confirm project exists

### Database tables don't exist
- Backend auto-creates them on first run
- Check backend logs for initialization messages
- If issues persist, manually create tables via Supabase SQL editor

## 📦 Production Build

```bash
# Frontend
cd frontend
npm run build
# Creates optimized dist/ folder

# Backend
# Deploy to Render/Railway with environment variables
```

## 🔗 Useful Links

- Supabase Dashboard: https://app.supabase.com/
- Render Dashboard: https://dashboard.render.com/
- Local Backend: http://localhost:5000/api/health
- Local Frontend: http://localhost:3000

## ✅ Verify Installation

```bash
# Health check backend
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-21T..."}
```

Done! 🎉 Your LinkVault instance is running locally.
