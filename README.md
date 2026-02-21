# LinkVault - Smart Link Sharing Platform

A production-ready, full-stack web application for saving, organizing, and publicly sharing hyperlinks with engagement analytics.

## 🎯 Overview

LinkVault enables authenticated users to:
- **Save links** with rich metadata (title, URL, description, tags)
- **Auto-extract metadata** (favicon, domain, page title) from URLs
- **Share publicly** with unique, unauthenticated-accessible URLs
- **Track engagement** with visit counters and analytics
- **View analytics dashboard** with aggregated insights

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** - UI library
- **Redux + Redux Thunk** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

#### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **PostgreSQL** (Supabase) - Database
- **Cheerio** - HTML parsing for metadata extraction
- **Supabase Auth** - Authentication & session management

#### Infrastructure
- **Supabase** - Auth + Database (PostgreSQL)
- **Render** or **Vercel** - Deployment

### Project Structure

```
linkVault/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── init.js          # Database schema initialization
│   │   │   └── supabase.js      # Supabase client setup
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication endpoints
│   │   │   ├── links.js         # Link CRUD endpoints
│   │   │   ├── public.js        # Public link endpoints
│   │   │   └── analytics.js     # Analytics endpoints
│   │   ├── services/
│   │   │   ├── links.js         # Link business logic
│   │   │   └── metadata.js      # Metadata extraction service
│   │   └── utils/
│   │       ├── helpers.js       # Utility functions
│   │       └── validation.js    # Input validation schemas
│   ├── server.js                # Express app entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Main layout with navbar
│   │   │   ├── ProtectedRoute.jsx   # Auth protection wrapper
│   │   │   ├── LinkCard.jsx         # Link display card
│   │   │   └── CreateLinkForm.jsx   # Link creation form
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Registration page
│   │   │   ├── Dashboard.jsx        # Links management
│   │   │   ├── Analytics.jsx        # Analytics dashboard
│   │   │   └── PublicLink.jsx       # Public link page
│   │   ├── redux/
│   │   │   ├── store.js             # Redux store setup
│   │   │   └── slices/
│   │   │       ├── auth.js          # Auth reducer & actions
│   │   │       ├── links.js         # Links reducer & actions
│   │   │       └── analytics.js     # Analytics reducer & actions
│   │   ├── styles/                  # CSS files
│   │   ├── utils/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   └── supabase.js          # Supabase client
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md (this file)
```

## 📊 Database Schema

### Tables

#### `users`
Created via Supabase Auth. Additional profile data can be stored here.
- `id` (UUID, PK) - References auth.users
- `email` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `links`
User's saved links.
- `id` (UUID, PK)
- `user_id` (UUID, FK) - Owner of link
- `title` (TEXT) - User-provided title
- `url` (TEXT) - Destination URL
- `description` (TEXT) - Optional summary
- `visibility` (ENUM) - 'public' or 'private'
- `fetched_title` (TEXT) - Title from page metadata
- `domain` (TEXT) - Extracted domain
- `favicon_url` (TEXT) - Domain favicon URL
- `click_count` (INTEGER) - Visit counter
- `slug` (TEXT, UNIQUE) - URL-safe identifier
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### `tags`
Tag categories for organizing links.
- `id` (UUID, PK)
- `name` (TEXT, UNIQUE) - Tag label
- `created_at` (TIMESTAMPTZ)

#### `link_tags` (Join Table)
Associates links with tags.
- `link_id` (UUID, FK)
- `tag_id` (UUID, FK)
- PRIMARY KEY (link_id, tag_id)

#### `link_clicks` (Optional)
Audit log for link visits.
- `id` (UUID, PK)
- `link_id` (UUID, FK)
- `visited_at` (TIMESTAMPTZ)
- `user_agent` (TEXT)
- `referrer` (TEXT)

### ER Diagram

```
users
  └─> links (one → many)
        ├─> link_tags (one → many)
        │     └─> tags (many ← one)
        └─> link_clicks (one → many, optional)
```

## 🔐 Security

### Authentication
- **Supabase Auth** handles user registration and login securely
- **JWT tokens** stored in localStorage (secure for browser context)
- **Session persistence** across page refreshes
- **Automatic session cleanup** on logout

### Authorization
- **Row Level Security (RLS)** policies enforce data isolation at database level
- Users can only read their own private links
- Public links readable by anyone (no auth required)
- Users cannot modify other users' links
- Service Role Key kept server-side only

### Input Validation
- Email format validation (Joi schema)
- URL validation before metadata fetch
- Link data validation (title, description length limits)
- XSS protection through React's built-in escaping

### Environment Variables
- All secrets stored in `.env.local` (gitignored)
- `.env.example` provided with placeholder values
- Service Role Key never exposed to frontend
- Anon Key safe in browser (limited permissions)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- (Optional) Render account for deployment

### Installation

#### 1. Clone & Setup

```bash
git clone <repo-url>
cd linkVault
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env.local (already provided)
# Add your Supabase credentials

# Start backend (will initialize database)
npm run dev
```

Backend runs on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (already provided)
# Environment variables point to backend

# Start frontend dev server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Environment Variables

#### Backend `.env.local`
```
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.local`
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000
```

## 📝 API Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (client destroys token)

### Links (Protected)
- `GET /api/links` - Get user's links
- `GET /api/links/:id` - Get single link
- `POST /api/links` - Create link (auto-fetches metadata)
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link

### Public Links (No Auth)
- `GET /api/public/l/:slug` - Get & view public link (increments clicks)
- `GET /api/public/r/:slug` - Redirect to actual URL (increments clicks)

### Analytics (Protected)
- `GET /api/analytics` - Get user's analytics dashboard data

## 🎨 Features Implemented

### ✅ Authentication & Sessions
- Email/password signup and login
- Secure session management with JWT
- Protected routes (dashboard, analytics)
- Session persistence across refreshes
- Logout with token cleanup

### ✅ Link Management
- Create links with title, URL, description, tags
- Edit existing links (including toggling visibility)
- Delete links with cascade cleanup
- Tag management (create/reuse/deduplicate)
- Search and filter by visibility

### ✅ Metadata Extraction
- Automatic page title extraction via Cheerio
- Favicon URL retrieval
- Domain extraction
- Graceful failure handling (link created even if metadata fetch fails)
- Timeout protection on requests

### ✅ Public Sharing
- Unique, collision-safe slugs for each public link
- Public link viewable without authentication
- Public link display with metadata
- Click tracking on visits

### ✅ Analytics Dashboard
- Total links count
- Public vs private breakdown
- Total clicks across all public links
- Most visited link highlight
- Links grouped by tag

### ✅ Code Quality
- Clear separation of concerns (auth, DB, routes, services)
- Modular componentin structure
- Redux for predictable state management
- Input validation with Joi schemas
- Error handling and logging

## 🧪 Testing the Application

### User Flow:
1. Visit `http://localhost:3000`
2. Sign up with email/password
3. Create a few links with different URLs
4. Set some as public, some as private
5. View the Dashboard with all links
6. Visit Analytics to see aggregated metrics
7. Share a public link URL and visit it without auth
8. Click "Visit Link" to increment click counter

### API Testing (using curl or Postman):

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create link (with Bearer token)
curl -X POST http://localhost:5000/api/links \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"GitHub",
    "url":"https://github.com",
    "description":"Code hosting",
    "visibility":"public",
    "tags":["development","tools"]
  }'

# Get public link (no auth)
curl http://localhost:5000/api/public/l/github-abc123
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output in dist/ folder
```

### Backend Deployment
- Deploy to Render, Railway, or Vercel
- Set environment variables in hosting platform
- Database tables auto-initialize on first run

## ⚙️ Edge Cases Handled

1. **Metadata fetch failures** - Link created with user-provided title
2. **Missing page titles** - Uses user title as fallback
3. **Slug collisions** - Appends random suffix to ensure uniqueness
4. **Very long URLs/descriptions** - Truncated or validated by column limits
5. **Same tag twice in form** - Deduplicated before saving
6. **Tag already exists** - Upserted (reused if exists, created if not)
7. **Another user tries to edit your link** - RLS policy blocks at DB level
8. **Deleted link** - Cascade deletes associated link_tags rows
9. **Private link direct URL** - Returns 404 without revealing existence
10. **Session expiry** - Auto-redirects to login on 401 response

## 🔧 Configuration

### Frontend
- Vite configured with React plugin
- Proxy for `/api` routes to backend
- Build output to `dist/` directory

### Backend
- Express CORS enabled
- JSON body parser middleware
- Error handling with try-catch
- Graceful metadata fetch failures

## 📚 Development Notes

### Design Decisions
1. **Redux over Context** - Better for large state trees and time-travel debugging
2. **Cheerio over Puppeteer** - Lightweight HTML parsing, no browser automation overhead
3. **Separate metadata service** - Decoupled, reusable, easy to test
4. **RLS at database level** - Security-first approach, not just application checks
5. **Slug with random suffix** - Simple collision prevention vs UUID (more readable URLs)

### Future Enhancements
- Advanced analytics (charts, date ranges)
- Full-text search
- Bulk link import/export
- Social sharing features
- Link preview images
- Custom branding for public pages
- Rate limiting on click tracking
- Dark mode support
- Mobile app

## 📄 License

MIT License - feel free to use and modify

## 🤝 Support

For issues or questions, please refer to the API documentation and code comments.

---

**Built with ❤️ - Production-ready LinkVault** | February 2026
