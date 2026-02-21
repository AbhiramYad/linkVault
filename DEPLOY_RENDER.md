# LinkVault Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (https://render.com)
- Your Supabase project credentials

## Step 1: Push to GitHub

First, create a GitHub repository and push your code:

```bash
cd linkVault
git init
git add .
git commit -m "Initial commit - LinkVault"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linkvault.git
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Blueprint)

1. Go to https://render.com/
2. Log in or sign up
3. Click **"New"** → **"Blueprint"**
4. Connect your GitHub repository
5. Select the `linkvault` repository
6. Render will detect `render.yaml` and configure automatically
7. Set environment variables when prompted

### Option B: Manual Setup

1. Go to https://render.com/
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `linkvault`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     cd frontend && npm install && npm run build && cp -r dist ../backend/public && cd ../backend && npm install
     ```
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid for better performance)

## Step 3: Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://ellafziogibnsbxakhrf.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `Your service role key from Supabase` |
| `SUPABASE_ANON_KEY` | `Your anon key from Supabase` |

## Step 4: Update Supabase Settings

In your Supabase project:

1. Go to **Authentication** → **URL Configuration**
2. Add your Render URL to **Site URL**:
   ```
   https://linkvault-xxxx.onrender.com
   ```
3. Add to **Redirect URLs**:
   ```
   https://linkvault-xxxx.onrender.com/*
   ```

## Step 5: Deploy

1. Click **"Create Web Service"** or **"Deploy"**
2. Wait for build to complete (5-10 minutes)
3. Once deployed, your app will be live at:
   ```
   https://linkvault-xxxx.onrender.com
   ```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Ensure Node version is 18+

### 500 Errors
- Verify environment variables are set correctly
- Check Render logs for errors

### Auth Issues
- Ensure Supabase Site URL matches your Render URL
- Add Render URL to Supabase redirect URLs

### Database Issues
- Verify tables exist in Supabase
- Check RLS policies are correct

## Free Tier Limitations

Render free tier:
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 512 MB RAM

For better performance, upgrade to a paid plan.

## Live URL

After deployment, your app will be available at:
```
https://linkvault.onrender.com
```
(or whatever name you chose)

## Need Help?

Check Render documentation: https://render.com/docs
