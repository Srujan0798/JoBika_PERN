# JoBika - UI/UX Design System

## Design Mockups

### Landing Page
![Landing Page Mockup](C:/Users/Student/.gemini/antigravity/brain/e721457c-5f42-472f-ab5e-336a6fca094c/landing_page_mockup_1764159614845.png)

**Key Features:**
- Hero section with compelling value proposition
- Feature highlights with icons
- Pricing tiers (Free, Pro, Enterprise)
- Clear call-to-action buttons

---

### Authentication
![Authentication Page Mockup](C:/Users/Student/.gemini/antigravity/brain/e721457c-5f42-472f-ab5e-336a6fca094c/auth_page_mockup_1764159631999.png)

**Key Features:**
- Split-screen design with testimonial
- Email/password login
- Social authentication (Google, LinkedIn)
- Clean, minimal form design

---

### Resume Upload
![Resume Upload Mockup](C:/Users/Student/.gemini/antigravity/brain/e721457c-5f42-472f-ab5e-336a6fca094c/resume_upload_mockup_1764159657752.png)

**Key Features:**
- Drag-and-drop file upload
- Before/after AI enhancement preview
- Progress indicator
- Supported formats clearly shown

---

### Dashboard
![Dashboard Mockup](C:/Users/Student/.gemini/antigravity/brain/e721457c-5f42-472f-ab5e-336a6fca094c/dashboard_mockup_1764159677297.png)

**Key Features:**
- Key metrics at a glance (applications, interviews, offers)
- Recommended jobs with match scores
- Recent activity timeline
- Quick action buttons

---

## Color Palette

### Primary Colors
```css
--primary-blue: #6366f1;      /* Primary brand color */
--primary-purple: #8b5cf6;    /* Secondary brand color */
--primary-indigo: #4f46e5;    /* Accent color */
```

### Semantic Colors
```css
--success: #22c55e;           /* Success states, high match scores */
--warning: #f59e0b;           /* Warning states, medium match scores */
--error: #ef4444;             /* Error states, low match scores */
--info: #3b82f6;              /* Informational messages */
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Dark Theme
```css
--bg-dark: #0a0a0f;
--bg-card: #13131f;
--bg-elevated: #1e1e2e;
--border-dark: #2d2d3d;
--text-primary: #ffffff;
--text-secondary: #94a3b8;
```

---

## Typography

### Font Families
```css
--font-display: 'Outfit', sans-serif;        /* Headings, hero text */
--font-body: 'Inter', sans-serif;            /* Body text, UI */
--font-mono: 'Fira Code', monospace;         /* Code, technical content */
```

### Font Scales
```css
/* Display */
--text-5xl: 3rem;      /* 48px - Hero headlines */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section headers */

/* Headings */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subheadings */
--text-lg: 1.125rem;   /* 18px - Large body */

/* Body */
--text-base: 1rem;     /* 16px - Default body */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}
```

---

### Cards

```css
.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

/* Dark theme card */
.card-dark {
  background: var(--bg-card);
  border: 1px solid var(--border-dark);
  backdrop-filter: blur(10px);
}
```

---

### Input Fields

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

---

### Match Score Badge

```css
.match-score {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
}

.match-score.high {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success);
}

.match-score.medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.match-score.low {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}
```

---

## Iconography

### Icon System
- **Library**: Lucide Icons (lightweight, consistent)
- **Size Scale**: 16px, 20px, 24px, 32px, 48px
- **Style**: Outline style with 2px stroke width

### Common Icons
- **Navigation**: Home, Search, User, Settings, Bell
- **Actions**: Plus, Edit, Trash, Download, Upload
- **Status**: Check, X, AlertCircle, Info
- **Job Related**: Briefcase, MapPin, DollarSign, Clock

---

## Animations & Transitions

### Standard Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;
```

### Micro-interactions

#### Button Hover
```css
@keyframes button-hover {
  from { transform: translateY(0); }
  to { transform: translateY(-2px); }
}
```

#### Card Entry
```css
@keyframes card-entry {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

---

## Accessibility Guidelines

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio (WCAG AA)
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Clear focus states

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators (outline or shadow)
- Logical tab order

### Screen Readers
- Semantic HTML elements
- ARIA labels for icons and interactive elements
- Alt text for all images

---

## Design Principles

### 1. **Clarity**
- Clear hierarchy and information architecture
- Consistent labeling and terminology
- Obvious call-to-action buttons

### 2. **Efficiency**
- Minimize clicks to complete tasks
- Smart defaults and auto-fill
- Keyboard shortcuts for power users

### 3. **Delight**
- Smooth animations and transitions
- Celebratory moments (successful application)
- Personalized recommendations

### 4. **Trust**
- Professional, polished design
- Transparent AI processes
- Clear data privacy messaging

---

## UI Patterns

### Empty States
- Friendly illustration or icon
- Clear explanation of what's missing
- Primary action to resolve (e.g., "Upload Resume")

### Loading States
- Skeleton screens for content loading
- Progress indicators for long operations
- Optimistic UI updates where possible

### Error States
- Clear error messages in plain language
- Suggestions for resolution
- Option to retry or contact support

### Success States
- Confirmation messages
- Visual feedback (checkmark, animation)
- Next steps or related actions
