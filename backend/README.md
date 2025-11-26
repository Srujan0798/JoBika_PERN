# JoBika Backend - Installation & Usage Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python server.py
```

The server will start on `http://localhost:5000`

### 3. Seed Database with Sample Jobs
```bash
# In a new terminal or use Postman/curl
curl -X POST http://localhost:5000/api/seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume/upload` - Upload resume (requires auth)
- `GET /api/resume/:id` - Get resume details (requires auth)

### Jobs
- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get specific job

### Applications
- `POST /api/applications` - Create new application (requires auth)
- `GET /api/applications` - Get user's applications (requires auth)

### Utility
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database with sample jobs

## Features Implemented

✅ **User Authentication**
- JWT-based authentication
- Password hashing with SHA-256
- Register and login endpoints

✅ **Resume Management**
- File upload (PDF/DOCX support planned)
- Basic text enhancement (rule-based)
- Skill extraction from resume text

✅ **Job Listings**
- 6 sample jobs from top Indian companies
- Search and filter capabilities
- Match score calculation

✅ **Application Tracking**
- Create applications
- Track application status
- Calculate match scores

✅ **Database**
- SQLite (no external database needed)
- Automatic schema creation
- Sample data seeding

## Database Schema

### Users
- id, email, password_hash, full_name, phone, created_at

### Resumes
- id, user_id, filename, original_text, enhanced_text, skills, experience_years, created_at

### Jobs
- id, title, company, location, salary, description, required_skills, posted_date, source, created_at

### Applications
- id, user_id, job_id, resume_id, status, match_score, applied_at

### Saved Jobs
- id, user_id, job_id, saved_at

## Next Steps

1. **Connect Frontend**: Update frontend to call these APIs
2. **Add PDF Parsing**: Install PyPDF2 or pdfplumber
3. **Improve AI**: Add better resume enhancement logic
4. **Job Scraping**: Add scrapers for LinkedIn, Naukri, Unstop
5. **Real-time Updates**: Add WebSocket support

## Testing

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Jobs
```bash
curl http://localhost:5000/api/jobs
```

## Cost: FREE! 🎉
- No external API costs
- No database hosting fees
- Runs completely locally
- Perfect for development and testing
