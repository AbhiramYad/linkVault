# LinkVault - Developer Setup & Running Guide

## 🎯 Project Status

✅ **Complete** - LinkVault is fully built and ready to run locally!

All code is generated, dependencies are configured, and your Supabase credentials are already set up in `.env.local` files.

## 📂 What Was Created

### Backend (Express + Node.js)
- Express server with CORS and middleware
- Supabase integration for Auth + Database
- RESTful API endpoints for all features
- Metadata extraction service (Cheerio)
- Database initialization script
- Redux Thunk for async actions
- Complete error handling

### Frontend (React + Vite)
- React 18 with React Router
- Redux + Redux Thunk state management
- Vite build tool with dev server
- Responsive UI with Tailwind CSS
- Protected routes and authentication
- Redux slices for auth, links, analytics

### Database (PostgreSQL via Supabase)
- `users`, `links`, `tags`, `link_tags` tables
- `link_clicks` audit table (optional)
- Row Level Security (RLS) policies
- Foreign key constraints
- Indexes for performance

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- Two terminal windows/tabs

### Backend (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
LinkVault backend running on http://localhost:5000
✓ Database schema initialized successfully
```

**What happens on first run:**
- Connects to Supabase
- Creates all database tables automatically
- Sets up Row Level Security policies
- Ready to accept API requests

### Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### Access the Application

Open your browser and go to: **http://localhost:3000**

You should see the LinkVault home page with login/signup buttons.

## 🧪 Testing the Application

### Test Account
Create a new account during signup:
- Email: `test@example.com` (or any email)
- Password: `TestPassword123!`

### Create Your First Link
1. Click "+ Add Link" on dashboard
2. Enter URL: `https://github.com`
3. Title will auto-populate
4. Add description: "Where the code lives"
5. Add tags: `github, development`
6. Set visibility: "Public"
7. Click "Create Link"

### Test Public Sharing
1. Find your created link card
2. Click "Copy URL" button
3. Open new private/incognito browser window
4. Paste URL - you can see the link WITHOUT logging in!
5. Click counter increases with each visit

### Test Analytics
1. Create 3-5 links with some public
2. Click "Analytics" in navbar
3. See metrics appear:
   - Total Links
   - Public vs Private count
   - Total Clicks
   - Most Visited Link
   - Tags breakdown

## 📝 API Endpoints (for manual testing)

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create Account
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response includes `session.access_token` - save this for authenticated requests.

### Create Link (with auth token)
```bash
curl -X POST http://localhost:5000/api/links \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"GitHub",
    "url":"https://github.com",
    "description":"Code hosting platform",
    "visibility":"public",
    "tags":["development","tools"]
  }'
```

### View Public Link (no auth needed)
```bash
curl http://localhost:5000/api/public/l/github-abc123
```

## 🔧 How It Works (High Level)

### User Signs Up
1. Frontend sends email + password to backend
2. Supabase Auth creates secure account
3. Session token returned and stored
4. User redirected to dashboard

### User Creates Link
1. Frontend sends link data with auth token
2. Backend verifies authentication via token
3. Backend fetches page metadata (Cheerio)
4. Backend creates link record in PostgreSQL
5. Backend creates/links tags
6. Frontend refetches links and updates Redux store
7. New link appears in dashboard

### User Views Public Link
1. No authentication needed
2. Backend retrieves link by slug
3. Checks visibility = 'public'
4. Increments click count in database
5. Returns link data to frontend
6. Frontend displays link with live stats

### User Views Analytics
1. Frontend sends GET request with auth token
2. Backend queries all user's links
3. Computes aggregates (sum, count, max)
4. Joins with tags data
5. Returns metrics set
6. Frontend displays in dashboard

## 📦 Project Dependencies

### Backend
```
express - Web framework
@supabase/supabase-js - Supabase client
pg - PostgreSQL driver
cheerio - HTML parsing
uuid - ID generation
slugify - URL slug creation
joi - Input validation
axios - HTTP client
dotenv - Environment variables
```

### Frontend
```
react / react-dom - UI library
react-router-dom - Routing
react-redux - Redux bindings
redux / redux-thunk - State management
@supabase/supabase-js - Auth client
axios - HTTP client
vite - Build tool
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install` in backend directory

### Issue: Backend won't start - "Port 5000 in use"
**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti :5000 | xargs kill -9
```

### Issue: Frontend shows "Cannot reach API"
Make sure backend is running and check `.env.local` has:
```
VITE_API_URL=http://localhost:5000
```

### Issue: "Supabase connection failed"
- Verify `.env.local` has correct URL and keys
- Check internet connection
- Verify Supabase project is active in dashboard

### Issue: Database tables not created
- Check backend console for initialization errors
- Check Supabase SQL editor to see if tables exist
- Manually create them if needed (schema in README.md)

## 📚 File Locations

- **Main Backend:** `backend/server.js`
- **Main Frontend:** `frontend/src/App.jsx`
- **Backend Routes:** `backend/src/routes/`
- **frontend Pages:** `frontend/src/pages/`
- **Redux Store:** `frontend/src/redux/store.js`
- **Styles:** `frontend/src/styles/`

## 🚢 Deployment (Optional)

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel
```

### Backend (Render)
- Push backend code to GitHub
- Create new Web Service on Render
- Add environment variables
- Deploy!

## 📖 Documentation Files

- `README.md` - Complete architecture & documentation
- `QUICKSTART.md` - 5-minute setup guide
- `.env.example` files - Environment variable templates

## ✨ Next Steps

1. ✅ Run backend: `cd backend && npm install && npm run dev`
2. ✅ Run frontend: `cd frontend && npm install && npm run dev`
3. ✅ Create an account
4. ✅ Create & share links
5. ✅ Check analytics
6. ✅ Share feedback!

## 🎓 Learning Points

This project demonstrates:
- ✅ Full-stack architecture (frontend + backend)
- ✅ Authentication & authorization (JWT + RLS)
- ✅ Relational database modeling (normalized schema)
- ✅ Metadata extraction (HTML parsing)
- ✅ State management (Redux patterns)
- ✅ Error handling (graceful failures)
- ✅ Security best practices (no exposed secrets)
- ✅ Clean code organization (modular structure)

---

**Ready to run?** Start with the backend first, then frontend!
