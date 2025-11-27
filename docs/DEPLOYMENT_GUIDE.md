# JoBika PERN Stack Deployment Guide

## Overview

This guide will help you deploy JoBika (now PERN stack) to Render with Supabase PostgreSQL database.

---

## Prerequisites

- ✅ Supabase account and project created
- ✅ Render account (free tier available)
- ✅ GitHub repository with your code
- ✅ Gmail account for email notifications (optional)

---

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

Follow the detailed guide in [`docs/SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

**Quick Summary:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `jobika-production`
3. Choose region closest to your users
4. Save your database password!

### 1.2 Get Connection String

1. In Supabase dashboard → Settings → Database
2. Copy the connection string (URI format):
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. Replace `[PASSWORD]` with your actual password

---

## Step 2: Prepare Your Code

### 2.1 Push to GitHub

```bash
cd /path/to/JoBika_MERN
git add .
git commit -m "Migrated to PERN stack with Supabase"
git push origin main
```

### 2.2 Verify render.yaml

Make sure `render.yaml` is configured for Node.js:

```yaml
services:
  - type: web
    name: jobika-backend
    env: node
    buildCommand: cd server && npm install && npm run db:sync
    startCommand: cd server && npm start
```

---

## Step 3: Deploy to Render

### 3.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 3.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select `JoBika_MERN` repository

### 3.3 Configure Service

**Basic Settings:**
- **Name**: `jobika-backend`
- **Region**: Same as Supabase (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Environment**: `Node`
- **Build Command**: `cd server && npm install && npm run db:sync`
- **Start Command**: `cd server && npm start`

**Advanced Settings:**
- **Plan**: Free
- **Auto-Deploy**: Yes

### 3.4 Add Environment Variables

Click **"Environment"** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `DATABASE_URL` | `postgresql://postgres:...` | From Supabase |
| `JWT_SECRET` | Generate random string | Use: `openssl rand -base64 32` |
| `EMAIL_USER` | `your-email@gmail.com` | Optional |
| `EMAIL_PASSWORD` | Gmail app password | Optional |
| `FRONTEND_URL` | `https://your-frontend.com` | Or leave empty |

**To generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 3.5 Deploy

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Check logs for errors

---

## Step 4: Verify Deployment

### 4.1 Check Health Endpoint

Visit: `https://jobika-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-27T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 4.2 Test Database Connection

Check Render logs for:
```
✅ PostgreSQL Connected (Supabase)
🚀 JoBika Server Started!
```

### 4.3 Verify Tables in Supabase

1. Go to Supabase dashboard → Table Editor
2. You should see 8 tables:
   - `users`
   - `jobs`
   - `resumes`
   - `applications`
   - `resume_versions`
   - `skill_gaps`
   - `notifications`
   - `user_preferences`

---

## Step 5: Test API Endpoints

### 5.1 Register a User

```bash
curl -X POST https://jobika-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User"
  }'
```

Expected: JWT token and user object

### 5.2 Login

```bash
curl -X POST https://jobika-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 5.3 Get Jobs

```bash
curl https://jobika-backend.onrender.com/api/jobs
```

---

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
- Check `package.json` is valid JSON
- Verify Node version compatibility

**Error**: Database connection fails
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure password is URL-encoded

### Runtime Errors

**Error**: `relation "users" does not exist`
- Run database sync: `npm run db:sync`
- Or manually create tables in Supabase

**Error**: `JWT_SECRET is not defined`
- Add `JWT_SECRET` environment variable in Render

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Connect to Supabase
3. → Deploy frontend
4. → Set up custom domain
5. → Configure email notifications

**Your JoBika app is now live on PERN stack!** 🚀
