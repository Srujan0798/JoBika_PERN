# PDF and DOCX Parsing Utilities
import PyPDF2
from docx import Document
import re

def parse_pdf(filepath):
    """Extract text from PDF file"""
    try:
        text = ''
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + '\n'
        return text.strip()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None

def parse_docx(filepath):
    """Extract text from DOCX file"""
    try:
        doc = Document(filepath)
        text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return None

def extract_email(text):
    """Extract email from resume text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text):
    """Extract phone number from resume text"""
    # Indian phone patterns
    phone_patterns = [
        r'\+91[-\s]?\d{10}',
        r'\d{10}',
        r'\(\d{3}\)[-\s]?\d{3}[-\s]?\d{4}'
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_name(text):
    """Extract name from resume (first few lines)"""
    lines = text.split('\n')
    for line in lines[:5]:
        line = line.strip()
        if len(line) > 3 and len(line) < 50:
            # Simple heuristic: name is usually in first few lines
            if not '@' in line and not 'http' in line.lower():
                return line
    return None

def extract_skills(text):
    """Extract skills from resume text"""
    common_skills = [
        # Programming Languages
        'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'Go', 'Rust', 'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl',
        
        # Web Technologies
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI',
        'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind', 'jQuery',
        'Next.js', 'Nuxt.js', 'Svelte', 'Gatsby',
        
        # Mobile
        'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
        
        # Databases
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra',
        'Oracle', 'SQLite', 'DynamoDB', 'Firebase', 'Elasticsearch',
        
        # Cloud & DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
        'Terraform', 'Ansible', 'Git', 'GitHub', 'GitLab', 'Bitbucket',
        
        # Data Science & ML
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
        'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
        'NLP', 'Computer Vision', 'Data Analysis', 'Statistics',
        
        # APIs & Architecture
        'REST API', 'GraphQL', 'Microservices', 'Serverless', 'WebSocket',
        
        # Testing
        'Jest', 'Mocha', 'Pytest', 'Selenium', 'Cypress', 'JUnit',
        
        # Other
        'Agile', 'Scrum', 'JIRA', 'Linux', 'Bash', 'PowerShell'
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        # Check for whole word match
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found_skills.append(skill)
    
    return list(set(found_skills))  # Remove duplicates

def extract_experience_years(text):
    """Extract years of experience from resume"""
    # Look for patterns like "5 years", "5+ years", "5-7 years"
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience[:\s]+(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s+in'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0

def enhance_resume_text(original_text):
    """Enhanced resume text with better AI-like improvements"""
    enhanced = original_text
    
    # Action verb replacements
    action_verbs = {
        'worked on': 'developed and implemented',
        'did': 'executed',
        'made': 'created',
        'helped': 'facilitated',
        'was responsible for': 'managed and oversaw',
        'used': 'utilized and leveraged',
        'got': 'achieved',
        'did work': 'contributed to',
        'handled': 'orchestrated',
        'dealt with': 'managed',
        'worked with': 'collaborated with',
        'learned': 'acquired expertise in',
        'improved': 'optimized and enhanced',
        'fixed': 'resolved and debugged',
        'built': 'architected and developed',
        'created': 'designed and implemented'
    }
    
    for old, new in action_verbs.items():
        enhanced = re.sub(r'\b' + old + r'\b', new, enhanced, flags=re.IGNORECASE)
    
    # Add quantifiable metrics suggestions (as comments)
    lines = enhanced.split('\n')
    enhanced_lines = []
    
    for line in lines:
        enhanced_lines.append(line)
        # If line looks like a responsibility without numbers, suggest adding metrics
        if any(verb in line.lower() for verb in ['developed', 'managed', 'created', 'improved']):
            if not re.search(r'\d+', line):
                # This is a suggestion, not actual enhancement
                pass
    
    return '\n'.join(enhanced_lines)

def calculate_match_score(resume_skills, job_skills, resume_text='', job_description=''):
    """
    Calculate match score between resume and job
    Considers skills, keywords, and experience
    """
    if not resume_skills or not job_skills:
        return 50
    
    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    
    if not job_set:
        return 50
    
    # Skill match score (70% weight)
    skill_matches = len(resume_set.intersection(job_set))
    skill_score = (skill_matches / len(job_set)) * 70
    
    # Keyword match score (30% weight)
    keyword_score = 0
    if resume_text and job_description:
        resume_words = set(resume_text.lower().split())
        job_words = set(job_description.lower().split())
        common_words = resume_words.intersection(job_words)
        keyword_score = min((len(common_words) / max(len(job_words), 1)) * 30, 30)
    
    total_score = int(skill_score + keyword_score)
    
    # Clamp between 30-100
    return min(max(total_score, 30), 100)

def generate_skill_recommendations(resume_skills, job_skills):
    """Generate recommendations for missing skills"""
    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])
    
    missing_skills = job_set - resume_set
    
    recommendations = []
    for skill in missing_skills:
        # Find the original case from job_skills
        original_skill = next((s for s in job_skills if s.lower() == skill), skill)
        recommendations.append({
            'skill': original_skill,
            'priority': 'high' if skill in ['python', 'javascript', 'react', 'node.js'] else 'medium',
            'resources': f'Learn {original_skill} on Coursera, Udemy, or freeCodeCamp'
        })
    
    return recommendations[:5]  # Top 5 recommendations
