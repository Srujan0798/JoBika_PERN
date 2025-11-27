# Supabase Setup Guide for JoBika

## Overview

This guide will help you set up Supabase as the PostgreSQL database for JoBika.

---

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email

---

## Step 2: Create New Project

1. Click **"New Project"**
2. Fill in project details:
   - **Name**: `jobika` or `jobika-production`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India, `us-east-1` for US)
   - **Pricing Plan**: Free (includes 500MB database, 2GB bandwidth)

3. Click **"Create new project"**
4. Wait 2-3 minutes for provisioning

---

## Step 3: Get Connection String

1. In your Supabase project dashboard, click **"Settings"** (gear icon)
2. Navigate to **"Database"** section
3. Scroll to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

---

## Step 4: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase (optional, for direct API access)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Frontend
FRONTEND_URL=https://your-frontend-url.com
```

---

## Step 5: Run Database Migrations

Once you have the connection string:

```bash
cd server

# Install dependencies
npm install

# Run migrations to create tables
npm run migrate

# (Optional) Seed sample data
npm run seed
```

---

## Step 6: Verify Database Connection

Test the connection:

```bash
cd server
node -e "require('./config/database').sequelize.authenticate().then(() => console.log('✅ Connected to Supabase')).catch(e => console.error('❌ Error:', e))"
```

You should see: `✅ Connected to Supabase`

---

## Step 7: View Database in Supabase Dashboard

1. Go to **"Table Editor"** in Supabase dashboard
2. You should see all tables:
   - `users`
   - `jobs`
   - `applications`
   - `resumes`
   - `resume_versions`
   - `skill_gaps`
   - `notifications`
   - `user_preferences`

---

## Optional: Enable Row Level Security (RLS)

For additional security, you can enable RLS policies:

1. Go to **"Authentication"** → **"Policies"**
2. Enable RLS for each table
3. Create policies (example for `users` table):
   ```sql
   -- Users can only read their own data
   CREATE POLICY "Users can view own data"
   ON users FOR SELECT
   USING (auth.uid() = id);
   
   -- Users can update their own data
   CREATE POLICY "Users can update own data"
   ON users FOR UPDATE
   USING (auth.uid() = id);
   ```

**Note**: RLS is optional. The Node.js backend already handles authorization.

---

## Troubleshooting

### Connection Timeout
- Check your database password is correct
- Verify the connection string format
- Ensure your IP is not blocked (Supabase allows all IPs by default)

### Migration Errors
- Ensure `DATABASE_URL` is set correctly
- Check Supabase project is active (not paused)
- Verify you have the latest dependencies: `npm install`

### Tables Not Created
- Run migrations: `npm run migrate`
- Check migration files in `server/migrations/`
- View Supabase logs in dashboard

---

## Supabase Free Tier Limits

- **Database**: 500 MB
- **Bandwidth**: 2 GB/month
- **API Requests**: Unlimited
- **File Storage**: 1 GB
- **Paused after 1 week of inactivity** (can be reactivated)

For production with high traffic, consider upgrading to Pro ($25/month).

---

## Next Steps

1. ✅ Supabase project created
2. ✅ Connection string configured
3. ✅ Migrations run successfully
4. → Deploy to Render (see `docs/DEPLOYMENT_GUIDE.md`)

---

**Your JoBika database is now ready on Supabase!** 🚀
