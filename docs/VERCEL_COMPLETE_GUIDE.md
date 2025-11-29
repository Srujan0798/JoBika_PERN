# Frontend Deployment Guide (Vercel)

## Prerequisites

Before deploying, ensure:
- ✅ GitHub repository is up to date
- ✅ Backend API is live on Render (or will be soon)
- ✅ You have a Vercel account

## Method 1: Vercel CLI (Recommended)

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

OR use npx (no installation needed):
```bash
npx vercel
```

### Step 2: Deploy
In the project root:
```bash
npx vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N`
- **Project name?** → `jobika-frontend` (or keep default)
- **Directory?** → `./` (press Enter)
- **Want to override settings?** → `N`

### Step 3: Production Deployment
```bash
npx vercel --prod
```

## Method 2: Vercel Dashboard (GitHub Integration)

### Step 1: Connect Repository
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Authorize Vercel to access your GitHub
4. Select `Srujan0798/JoBika_PERN`
5. Click **Import**

### Step 2: Configure Project
- **Framework Preset**: Other
- **Root Directory**: `./` (leave as is)
- **Build Command**: Leave empty (static site)
- **Output Directory**: `app` (or leave as `./`)
- **Install Command**: Leave empty

### Step 3: Environment Variables
Add these (if needed):
- `API_URL`: `https://jobika-pern.onrender.com/api`

Click **Deploy**!

## Method 3: Manual Configuration

If auto-detection doesn't work, use `vercel.json`:

```json
{
  "version": 2,
  "public": true,
  "builds": [
    {
      "src": "app/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app/$1"
    }
  ]
}
```

This is already in your project root!

## Post-Deployment Setup

### Update Backend CORS
Add your Vercel URL to Render environment variables:

1. Go to Render Dashboard
2. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://your-app.vercel.app,https://jobika-pern.onrender.com
   ```

### Update Frontend API URLs
If hardcoded, update in `app/` files:
```javascript
const API_URL = 'https://jobika-pern.onrender.com/api';
```

## Verification

1. Open your Vercel URL (e.g., `https://jobika-frontend.vercel.app`)
2. Check:
   - ✅ Landing page loads
   - ✅ Login/Register works
   - ✅ Dashboard accessible
   - ✅ API calls to Render succeed

## Troubleshooting

### CORS Errors
Update `CLIENT_URL` on Render with your Vercel URL.

### 404 on Routes
Ensure `vercel.json` routes are correct.

### API Not Reachable
Check if Render backend is running:
```bash
curl https://jobika-pern.onrender.com/api/health
```

## Custom Domain (Optional)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `jobika.com`)
3. Update DNS records as instructed
4. SSL auto-configured by Vercel

## Expected URLs

After deployment:
- **Frontend**: `https://[project-name].vercel.app`
- **Backend**: `https://jobika-pern.onrender.com`
- **Database**: Supabase (private)

---

**Quick Deploy Command**:
```bash
npx vercel --prod
```

Done! 🚀
