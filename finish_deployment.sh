#!/bin/bash

echo "🚀 Starting Final Deployment Sequence..."

# 1. Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# 2. Deploy Frontend to Vercel
echo "🌐 Deploying Frontend to Vercel..."
echo "👉 Please follow the prompts to log in and deploy."
npx vercel --prod

# 3. Check Database Connection
echo "🗄️ Checking Database Connection..."
node scripts/verify_final.js

# 4. Run Feature Verification
echo "✅ Verifying All Features..."
node scripts/verify_features.js

echo "🎉 Deployment Sequence Complete!"
echo "If you see errors, please check docs/ACTION_REQUIRED.md"
