# JoBika - Technical Architecture

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Application<br/>React/HTML5]
        MOBILE[Mobile App<br/>React Native]
    end
    
    subgraph "API Gateway"
        GATEWAY[API Gateway<br/>Rate Limiting, Auth]
    end
    
    subgraph "Application Services"
        AUTH[Auth Service<br/>JWT, OAuth]
        RESUME[Resume Service<br/>Upload, Parse, Store]
        JOB[Job Service<br/>Search, Filter, Match]
        APPLY[Application Service<br/>Auto-Apply, Tracking]
        ANALYTICS[Analytics Service<br/>Metrics, Insights]
    end
    
    subgraph "AI Engine"
        PARSER[Resume Parser<br/>NLP, Extraction]
        OPTIMIZER[Resume Optimizer<br/>GPT-4/Claude]
        MATCHER[Job Matcher<br/>Vector Search]
        GENERATOR[Content Generator<br/>Cover Letters]
    end
    
    subgraph "External Services"
        LINKEDIN[LinkedIn API]
        NAUKRI[Naukri Scraper]
        UNSTOP[Unstop API]
        COMPANY[Company Websites]
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL<br/>User Data, Jobs)]
        REDIS[(Redis<br/>Cache, Sessions)]
        S3[(S3/Storage<br/>Resume Files)]
        VECTOR[(Vector DB<br/>Embeddings)]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    
    GATEWAY --> AUTH
    GATEWAY --> RESUME
    GATEWAY --> JOB
    GATEWAY --> APPLY
    GATEWAY --> ANALYTICS
    
    RESUME --> PARSER
    RESUME --> OPTIMIZER
    RESUME --> S3
    
    JOB --> MATCHER
    JOB --> LINKEDIN
    JOB --> NAUKRI
    JOB --> UNSTOP
    JOB --> COMPANY
    
    APPLY --> GENERATOR
    APPLY --> OPTIMIZER
    
    AUTH --> POSTGRES
    AUTH --> REDIS
    RESUME --> POSTGRES
    JOB --> POSTGRES
    APPLY --> POSTGRES
    ANALYTICS --> POSTGRES
    
    MATCHER --> VECTOR
    PARSER --> POSTGRES
    OPTIMIZER --> POSTGRES
    
    style WEB fill:#6366f1,color:#fff
    style MOBILE fill:#6366f1,color:#fff
    style GATEWAY fill:#8b5cf6,color:#fff
    style PARSER fill:#a855f7,color:#fff
    style OPTIMIZER fill:#a855f7,color:#fff
    style MATCHER fill:#a855f7,color:#fff
    style GENERATOR fill:#a855f7,color:#fff
```

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ RESUMES : has
    USERS ||--o{ APPLICATIONS : submits
    USERS ||--o{ PREFERENCES : sets
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        string phone
        timestamp created_at
        timestamp last_login
        enum subscription_tier
    }
    
    RESUMES ||--o{ RESUME_VERSIONS : has
    RESUMES {
        uuid id PK
        uuid user_id FK
        string original_file_url
        json parsed_data
        boolean is_primary
        timestamp created_at
        timestamp updated_at
    }
    
    RESUME_VERSIONS {
        uuid id PK
        uuid resume_id FK
        string version_name
        enum job_category
        json customized_data
        timestamp created_at
    }
    
    JOBS ||--o{ APPLICATIONS : receives
    JOBS {
        uuid id PK
        string title
        string company
        string location
        text description
        json requirements
        string source
        string external_url
        timestamp posted_at
        timestamp scraped_at
    }
    
    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        uuid resume_version_id FK
        enum status
        float match_score
        json ai_modifications
        timestamp applied_at
        timestamp updated_at
    }
    
    PREFERENCES {
        uuid id PK
        uuid user_id FK
        json job_categories
        json locations
        int min_salary
        int max_salary
        boolean auto_apply_enabled
        json auto_apply_criteria
    }
    
    ANALYTICS ||--|| USERS : tracks
    ANALYTICS {
        uuid id PK
        uuid user_id FK
        int total_applications
        int interviews_received
        int offers_received
        float avg_match_score
        json skill_gaps
        timestamp last_calculated
    }
```

---

## User Flow Diagram

```mermaid
flowchart TD
    START([User Visits JoBika]) --> LANDING[Landing Page]
    LANDING --> SIGNUP{New User?}
    
    SIGNUP -->|Yes| REGISTER[Sign Up<br/>Email/Google/LinkedIn]
    SIGNUP -->|No| LOGIN[Login]
    
    REGISTER --> ONBOARD[Onboarding]
    LOGIN --> DASHBOARD
    
    ONBOARD --> UPLOAD{Has Resume?}
    UPLOAD -->|Yes| UPLOAD_FILE[Upload Resume<br/>PDF/DOCX]
    UPLOAD -->|No| MANUAL_ENTRY[Manual Data Entry]
    
    UPLOAD_FILE --> AI_PARSE[AI Parses Resume]
    MANUAL_ENTRY --> AI_ENHANCE[AI Enhances Content]
    
    AI_PARSE --> REVIEW[Review & Approve<br/>AI Suggestions]
    AI_ENHANCE --> REVIEW
    
    REVIEW --> SET_PREFS[Set Job Preferences<br/>Roles, Location, Salary]
    SET_PREFS --> DASHBOARD[Dashboard]
    
    DASHBOARD --> ACTION{Choose Action}
    
    ACTION -->|Browse Jobs| JOB_SEARCH[Job Search Page]
    ACTION -->|Edit Resume| RESUME_EDITOR[Resume Editor]
    ACTION -->|View Applications| TRACKER[Application Tracker]
    ACTION -->|Settings| SETTINGS[Settings]
    
    JOB_SEARCH --> VIEW_JOB[View Job Details<br/>Match Score]
    VIEW_JOB --> APPLY_DECISION{Apply?}
    
    APPLY_DECISION -->|Manual| CUSTOMIZE[Customize Resume<br/>for This Job]
    APPLY_DECISION -->|Auto| AUTO_APPLY[AI Auto-Applies]
    
    CUSTOMIZE --> SUBMIT[Submit Application]
    AUTO_APPLY --> SUBMIT
    
    SUBMIT --> TRACKER
    TRACKER --> DASHBOARD
    
    RESUME_EDITOR --> DASHBOARD
    SETTINGS --> DASHBOARD
    
    style START fill:#22c55e,color:#fff
    style DASHBOARD fill:#6366f1,color:#fff
    style AI_PARSE fill:#a855f7,color:#fff
    style AI_ENHANCE fill:#a855f7,color:#fff
    style AUTO_APPLY fill:#a855f7,color:#fff
    style SUBMIT fill:#22c55e,color:#fff
```

---

## Auto-Apply Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant JobService
    participant AIEngine
    participant ResumeService
    participant ExternalSite
    participant Tracker
    
    User->>Dashboard: Enable Auto-Apply
    User->>Dashboard: Set Criteria (roles, companies, match %)
    
    loop Every 6 Hours
        JobService->>ExternalSite: Scrape New Jobs
        ExternalSite-->>JobService: Job Listings
        JobService->>JobService: Filter by User Preferences
        
        JobService->>AIEngine: Calculate Match Scores
        AIEngine-->>JobService: Scored Jobs (>70% match)
        
        loop For Each Matching Job
            JobService->>ResumeService: Get User's Base Resume
            ResumeService-->>JobService: Resume Data
            
            JobService->>AIEngine: Optimize Resume for Job
            AIEngine->>AIEngine: Analyze Job Requirements
            AIEngine->>AIEngine: Highlight Relevant Skills
            AIEngine->>AIEngine: Adjust Keyword Density
            AIEngine-->>JobService: Customized Resume
            
            JobService->>ExternalSite: Navigate to Application
            JobService->>ExternalSite: Fill Form Fields
            JobService->>ExternalSite: Upload Resume
            JobService->>ExternalSite: Submit Application
            
            ExternalSite-->>JobService: Confirmation
            
            JobService->>Tracker: Log Application
            Tracker->>Dashboard: Update UI
            Dashboard->>User: Notification (Email/Push)
        end
    end
    
    User->>Tracker: View Applications
    Tracker-->>User: Application Status
```

---

## Technology Stack Details

### Frontend
- **Framework**: React 18 with TypeScript (or Vanilla JS for MVP)
- **Styling**: Tailwind CSS / Vanilla CSS with CSS Variables
- **State Management**: Zustand / Context API
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation
- **Charts**: Chart.js / Recharts

### Backend
- **Runtime**: Node.js 20+ with Express.js
- **Language**: TypeScript
- **API**: RESTful + GraphQL (future)
- **Authentication**: JWT + OAuth 2.0 (Google, LinkedIn)
- **File Upload**: Multer + AWS S3

### AI/ML
- **Resume Parsing**: spaCy, PyResParser, or GPT-4 Vision
- **Content Generation**: OpenAI GPT-4 / Anthropic Claude
- **Embeddings**: OpenAI text-embedding-3 / Sentence Transformers
- **Vector Search**: Pinecone / Weaviate / pgvector

### Database
- **Primary DB**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Vector Store**: Pinecone / pgvector extension
- **File Storage**: AWS S3 / Cloudflare R2

### Infrastructure
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **CDN**: Cloudflare
- **Monitoring**: Sentry, LogRocket
- **Analytics**: PostHog, Mixpanel

### Job Scraping
- **Automation**: Puppeteer / Playwright
- **Proxies**: Bright Data / ScraperAPI
- **APIs**: LinkedIn API, Naukri API (if available)

---

## Security Architecture

```mermaid
graph LR
    subgraph "Security Layers"
        WAF[Web Application Firewall]
        RATE[Rate Limiting]
        AUTH[Authentication]
        ENCRYPT[Encryption at Rest]
        AUDIT[Audit Logs]
    end
    
    USER[User] --> WAF
    WAF --> RATE
    RATE --> AUTH
    AUTH --> API[API Services]
    API --> ENCRYPT
    ENCRYPT --> DB[(Database)]
    
    API --> AUDIT
    AUDIT --> LOGS[(Log Storage)]
    
    style WAF fill:#ef4444,color:#fff
    style AUTH fill:#f59e0b,color:#fff
    style ENCRYPT fill:#22c55e,color:#fff
```

### Security Measures
- **Data Encryption**: AES-256 for data at rest, TLS 1.3 for transit
- **Authentication**: JWT with refresh tokens, OAuth 2.0
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent abuse (100 req/min per user)
- **GDPR Compliance**: Data export, deletion, consent management
- **Audit Logs**: Track all sensitive operations

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: All services are stateless for easy scaling
- **Load Balancing**: Nginx/AWS ALB for traffic distribution
- **Database Replication**: Read replicas for query performance

### Caching Strategy
- **Redis Cache**: Job listings (1 hour TTL), user sessions
- **CDN**: Static assets, resume templates
- **API Response Cache**: Frequently accessed data

### Performance Targets
- **Page Load**: < 2 seconds
- **API Response**: < 500ms (p95)
- **Resume Processing**: < 10 seconds
- **Job Matching**: < 3 seconds for 1000 jobs
