# Supabase Setup Guide (Fresh Project)

> **Use this guide if your original project is paused/deleted**

## Step 1: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `JoBika_PERN`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `us-west-1`)
   - **Pricing Plan**: Free tier is fine
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

## Step 2: Get Connection Strings

Once project is ready:

1. Click **Settings** (left sidebar)
2. Click **Database**
3. Scroll to **"Connection String"** section
4. You'll see two modes:

### Session Mode (Port 5432) - DON'T USE
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```
❌ This is IPv6-only and won't work with Render!

### Transaction Mode (Port 6543) - USE THIS ✅
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
✅ This uses the pooler and supports IPv4!

**Copy the Transaction Mode string!**

## Step 3: Update Your Code

Replace the password placeholder `[YOUR-PASSWORD]` with your actual password.

**Example**:
```
postgresql://postgres.gvybvfbnqgzcisuchocz:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Step 4: Set Environment Variables

### Local (.env)
```bash
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Render Dashboard
1. Go to https://dashboard.render.com
2. Select your `JoBika_PERN` service
3. Go to **Environment** tab
4. Update `DATABASE_URL` with the pooler connection string
5. Click **Save Changes**
6. Render will auto-redeploy

## Step 5: Verify Connection

Run locally:
```bash
cd server
npm start
```

Check if database connects successfully.

## Step 6: Create Tables (Automatic)

The app uses `sequelize.sync({ alter: true })` which will:
- Create all 8 tables automatically
- Set up foreign keys
- Create indexes

Tables created:
1. `Users`
2. `Jobs`
3. `Applications`
4. `Resumes`
5. `ResumeVersions`
6. `SkillGaps`
7. `Notifications`
8. `UserPreferences`

## Step 7: Verify in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. You should see all 8 tables
3. Click each table to verify columns

## Troubleshooting

### "ENOTFOUND" or "ENETUNREACH" Error
- Make sure you're using **Transaction Mode** (port 6543)
- Check password has no special characters that need escaping
- Verify the region matches your project

### Tables Not Created
- Check Render logs for errors
- Verify `NODE_ENV=production` is set
- Make sure `sequelize.sync({ alter: true })` is in `server/index.js`

### Connection Timeout
- Check if Supabase project is still active (not paused)
- Verify firewall/network settings
- Try connecting from local machine first

## Quick Verification Commands

```bash
# Test connection locally
node server/check_prod_db.js

# Verify API health
curl https://jobika-pern.onrender.com/api/health

# Check database connection
curl https://jobika-pern.onrender.com/api/debug-db
```

## Once Setup is Complete

Tell me: **"I have the pooler URL: [paste it here]"**

I'll update all configuration files and redeploy everything instantly! 🚀
