# 🚀 JoBika - AI-Powered Job Application Platform

> **Your intelligent job search companion - Built with PERN Stack (PostgreSQL + Express + React + Node.js)**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com)
[![Testing](https://img.shields.io/badge/Testing-Comprehensive-blue)](https://github.com)
[![Cost](https://img.shields.io/badge/Cost-$0%2Fmonth-green)](https://github.com)

---

## 🎯 What is JoBika?

JoBika is a **complete AI job agent** that helps you find and apply to jobs globally. It customizes your resume for each job, analyzes skill gaps, and can even auto-apply to matching positions while you sleep.

**Key Features**:
- 🤖 **AI Resume Customization** - Tailored resume for each job
- 📊 **Honest Skill Gap Analysis** - Know what to learn, with free resources
- 🌍 **Universal Job Search** - Find jobs in US, Europe, Asia, Remote
- ⚡ **Auto-Apply System** - Set preferences, let AI apply for you
- 📈 **Application Tracking** - Manage everything in one dashboard

---

## ✨ Features

### **Core Features**
- ✅ User authentication with JWT tokens
- ✅ Resume upload (PDF/DOCX) with AI parsing
- ✅ Job browsing with smart filtering
- ✅ One-click applications
- ✅ Application tracking dashboard
- ✅ Email notifications

### **AI Agent Features** ⭐
- ✅ **Resume Customization** - Creates job-specific resume versions
- ✅ **Skill Gap Analysis** - Shows matching vs missing skills
- ✅ **Universal Job Scraping** - LinkedIn, Indeed, Naukri, Unstop
- ✅ **Auto-Apply System** - Daily automated applications
- ✅ **Learning Recommendations** - Free resources for missing skills

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+
- PostgreSQL (or Supabase account)
- npm or yarn

### **Installation**

```bash
# Clone repository
git clone <your-repo-url>
cd JoBika_MERN

# Install dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase DATABASE_URL

# Run database sync
npm run db:sync

# Start server
npm run dev
```

### **Access Application**
```
Open http://localhost:5000 in your browser
```

---

## 📖 Usage

### **1. Register/Login**
```
Navigate to http://localhost:5000/auth.html
Create account or login
```

### **2. Upload Resume**
```
Go to Upload page
Upload PDF or DOCX resume
AI will extract skills and experience
```

### **3. Browse Jobs**
```
Visit Jobs page
Filter by location, salary, skills
See match scores for each job
```

### **4. Set Auto-Apply Preferences**
```
Go to Preferences page
Toggle auto-apply ON
Set target roles and locations
Configure salary range
```

### **5. Track Applications**
```
Dashboard shows all applications
Kanban board view
Status tracking
```

---

## 🏗️ Architecture

### **Backend**
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Sequelize
- **Authentication**: JWT tokens
- **Scheduling**: node-cron (cron jobs)

### **Frontend**
- **Pages**: 9 responsive pages
- **Styling**: Vanilla CSS with design system
- **JavaScript**: Vanilla JS with API integration

### **AI Features**
- **Resume Parser**: pdf-parse, mammoth
- **Job Scraper**: cheerio, axios
- **Customization**: Custom algorithms
- **Skill Analysis**: Semantic matching

---

## 📁 Project Structure

```
JoBika/
├── app/                          # Frontend
│   ├── index.html               # Landing page
│   ├── auth.html                # Authentication
│   ├── dashboard.html           # Dashboard
│   ├── jobs.html                # Job search
│   ├── preferences.html         # Auto-apply settings ⭐
│   ├── resume-versions.html     # Resume versions ⭐
│   └── assets/
│       ├── css/main.css
│       └── js/app.js
│
├── server/                       # Backend (Node.js/Express)
│   ├── index.js                 # Main server file
│   ├── config/
│   │   ├── config.js            # Configuration
│   │   └── database.js          # Sequelize setup
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── ...
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   └── package.json
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   └── PITCH_DECK.md
│
├── README.md                     # This file
├── docs/TESTING_COMPLETE.md          # Test results ⭐
└── docs/PROJECT_STATUS.md            # Current status ⭐
```

---

## 🧪 Testing

### **Run Tests**
```bash
# Check database
python backend/check_db.py

# Test API endpoints
# Registration
POST http://localhost:5000/api/auth/register
{
  "email": "test@example.com",
  "password": "test123",
  "fullName": "Test User"
}

# Get jobs
GET http://localhost:5000/api/jobs

# Scrape new jobs
POST http://localhost:5000/api/jobs/scrape
{
  "query": "software engineer",
  "location": "remote",
  "limit": 10
}
```

### **Test Results**
See `docs/TESTING_COMPLETE.md` for comprehensive test results.

**Summary**:
- ✅ All API endpoints working
- ✅ Database properly migrated
- ✅ User registration/login working
- ✅ Job scraping functional
- ✅ All pages loading

---

## 🌍 Universal Job Search

JoBika finds jobs **globally**, not limited to one country:

**Job Sources**:
- 🇺🇸 LinkedIn (US, Global)
- 🌐 Indeed (US, Europe, Remote)
- 🇮🇳 Naukri (India)
- 🎓 Unstop (India, Freshers)

**Sample Jobs**:
- Google (Remote, US) - $150k USD
- Spotify (Remote, Europe) - €80k EUR
- Flipkart (Bangalore) - ₹25 LPA
- Amazon (Mumbai) - ₹20-28 LPA

---

## 💰 Cost

**Total**: **$0/month** (Free tier)

**Free Services**:
- Render: Free tier (750 hours/month)
- Supabase: 500MB database, 2GB bandwidth
- Gmail SMTP: 500 emails/day
- node-cron: Free (built-in)

---

## 🔧 Configuration
---

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### **Resume**
- `POST /api/resume/upload` - Upload resume
- `POST /api/resume/customize` - Customize for job ⭐
- `POST /api/resume/skill-gap` - Analyze skill gap ⭐

### **Jobs**
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/scrape` - Scrape new jobs ⭐

### **Applications**
- `POST /api/applications` - Apply to job
- `GET /api/applications` - Get user applications

### **Preferences** ⭐
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Update preferences

### **Utility**
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database

---

## 🐛 Known Issues

**All critical bugs fixed!** ✅

**Fixed in Production**:
- ✅ Database schema mismatch (password_hash)
- ✅ DateTime import error in JWT generation

---

## 🚀 Deployment

### **Railway**
```bash
# Push to GitHub
git push origin main

# Connect to Railway
# Deploy automatically
```

### **Render**
```bash
# Use render.yaml configuration
# Deploy via Render dashboard
```

See `docs/DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📝 Documentation

- `README.md` - This file
- `docs/TESTING_COMPLETE.md` - Test results
- `docs/PROJECT_STATUS.md` - Current status
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/DESIGN_SYSTEM.md` - UI/UX design system
- `backend/README.md` - Backend documentation

---

## 🎯 Roadmap

**Phase 10** ✅ - AI Agent Features (COMPLETE)
**Phase 11** ✅ - Production Testing (COMPLETE)

**Future Enhancements**:
- [ ] Mobile app (React Native)
- [ ] Advanced AI models (Hugging Face)
- [ ] More job sources
- [ ] Analytics dashboard
- [ ] Employer side

---

## 👨‍💻 Author

**Created by**: Srujan Sai  
**Made in**: India  
**For**: Global job seekers everywhere

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Acknowledgments

- Flask team for the amazing framework
- BeautifulSoup for web scraping
- PyPDF2 for PDF parsing
- All open-source contributors

---

## 📞 Support

**Issues**: Create an issue on GitHub  
**Questions**: Contact via email

---

**JoBika helps job seekers succeed globally!** 🌍🚀

---

## ⭐ Star this repo if you find it helpful!
