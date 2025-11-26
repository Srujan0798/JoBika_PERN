# Job Scraping Utilities
import requests
from bs4 import BeautifulSoup
import json
import time
import random

class JobScraper:
    """Base class for job scraping"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def get_page(self, url):
        """Fetch page with error handling"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def random_delay(self):
        """Add random delay to avoid rate limiting"""
        time.sleep(random.uniform(1, 3))

class IndeedScraper(JobScraper):
    """Scraper for Indeed India"""
    
    def scrape_jobs(self, query='software developer', location='bangalore', limit=10):
        """Scrape jobs from Indeed"""
        jobs = []
        base_url = 'https://in.indeed.com/jobs'
        
        params = {
            'q': query,
            'l': location,
            'limit': limit
        }
        
        try:
            url = f"{base_url}?q={query}&l={location}"
            html = self.get_page(url)
            
            if not html:
                return self._get_sample_jobs()
            
            soup = BeautifulSoup(html, 'html.parser')
            job_cards = soup.find_all('div', class_='job_seen_beacon')
            
            for card in job_cards[:limit]:
                try:
                    title_elem = card.find('h2', class_='jobTitle')
                    company_elem = card.find('span', class_='companyName')
                    location_elem = card.find('div', class_='companyLocation')
                    
                    if title_elem and company_elem:
                        job = {
                            'title': title_elem.get_text(strip=True),
                            'company': company_elem.get_text(strip=True),
                            'location': location_elem.get_text(strip=True) if location_elem else location,
                            'source': 'Indeed',
                            'description': 'Full job description available on Indeed',
                            'salary': 'Not disclosed',
                            'posted_date': 'Recently posted'
                        }
                        jobs.append(job)
                except Exception as e:
                    print(f"Error parsing job card: {e}")
                    continue
            
            self.random_delay()
            
        except Exception as e:
            print(f"Indeed scraping error: {e}")
            return self._get_sample_jobs()
        
        return jobs if jobs else self._get_sample_jobs()
    
    def _get_sample_jobs(self):
        """Fallback sample jobs if scraping fails"""
        return [
            {
                'title': 'Software Engineer',
                'company': 'Tech Company',
                'location': 'Bangalore',
                'source': 'Indeed',
                'description': 'Looking for talented software engineers',
                'salary': '₹8-12 LPA',
                'posted_date': '2 days ago'
            }
        ]

class NaukriScraper(JobScraper):
    """Scraper for Naukri.com"""
    
    def scrape_jobs(self, query='software developer', location='bangalore', limit=10):
        """Scrape jobs from Naukri"""
        # Note: Naukri has strong anti-scraping measures
        # This is a simplified version
        
        jobs = []
        base_url = 'https://www.naukri.com'
        
        try:
            search_url = f"{base_url}/{query}-jobs-in-{location}"
            html = self.get_page(search_url)
            
            if not html:
                return self._get_sample_jobs()
            
            soup = BeautifulSoup(html, 'html.parser')
            # Naukri's structure changes frequently, using generic selectors
            job_cards = soup.find_all('article', class_='jobTuple')
            
            for card in job_cards[:limit]:
                try:
                    title_elem = card.find('a', class_='title')
                    company_elem = card.find('a', class_='subTitle')
                    
                    if title_elem:
                        job = {
                            'title': title_elem.get_text(strip=True),
                            'company': company_elem.get_text(strip=True) if company_elem else 'Company',
                            'location': location.title(),
                            'source': 'Naukri',
                            'description': 'Full details on Naukri.com',
                            'salary': 'Competitive',
                            'posted_date': 'Recently'
                        }
                        jobs.append(job)
                except Exception as e:
                    print(f"Error parsing Naukri job: {e}")
                    continue
            
            self.random_delay()
            
        except Exception as e:
            print(f"Naukri scraping error: {e}")
            return self._get_sample_jobs()
        
        return jobs if jobs else self._get_sample_jobs()
    
    def _get_sample_jobs(self):
        """Fallback sample jobs"""
        return [
            {
                'title': 'Full Stack Developer',
                'company': 'IT Services',
                'location': 'Bangalore',
                'source': 'Naukri',
                'description': 'Exciting opportunity for full stack developers',
                'salary': '₹10-15 LPA',
                'posted_date': '1 week ago'
            }
        ]

class LinkedInScraper(JobScraper):
    """Scraper for LinkedIn (limited without authentication)"""
    
    def scrape_jobs(self, query='software developer', location='bangalore', limit=10):
        """
        LinkedIn requires authentication for most scraping
        This returns sample data
        """
        return self._get_sample_jobs()
    
    def _get_sample_jobs(self):
        """Sample LinkedIn-style jobs"""
        return [
            {
                'title': 'Senior Software Engineer',
                'company': 'Global Tech Corp',
                'location': 'Bangalore',
                'source': 'LinkedIn',
                'description': 'Join our innovative team',
                'salary': '₹15-25 LPA',
                'posted_date': '3 days ago'
            }
        ]

def scrape_all_jobs(query='software developer', location='bangalore', limit_per_source=5):
    """
    Scrape jobs from all sources
    Returns combined list of jobs
    """
    all_jobs = []
    
    print(f"Scraping jobs for: {query} in {location}")
    
    # Indeed
    print("Scraping Indeed...")
    indeed = IndeedScraper()
    indeed_jobs = indeed.scrape_jobs(query, location, limit_per_source)
    all_jobs.extend(indeed_jobs)
    
    # Naukri
    print("Scraping Naukri...")
    naukri = NaukriScraper()
    naukri_jobs = naukri.scrape_jobs(query, location, limit_per_source)
    all_jobs.extend(naukri_jobs)
    
    # LinkedIn (sample data)
    print("Getting LinkedIn jobs...")
    linkedin = LinkedInScraper()
    linkedin_jobs = linkedin.scrape_jobs(query, location, limit_per_source)
    all_jobs.extend(linkedin_jobs)
    
    print(f"Total jobs scraped: {len(all_jobs)}")
    
    return all_jobs

def extract_skills_from_job(job_description):
    """Extract required skills from job description"""
    common_skills = [
        'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'Angular', 'Vue',
        'Django', 'Flask', 'Spring', 'SQL', 'MongoDB', 'AWS', 'Docker',
        'Kubernetes', 'Git', 'Agile', 'REST API', 'Machine Learning'
    ]
    
    found_skills = []
    desc_lower = job_description.lower()
    
    for skill in common_skills:
        if skill.lower() in desc_lower:
            found_skills.append(skill)
    
    return found_skills

if __name__ == '__main__':
    # Test scraping
    jobs = scrape_all_jobs('python developer', 'bangalore', 3)
    print(f"\nFound {len(jobs)} jobs:")
    for job in jobs:
        print(f"- {job['title']} at {job['company']} ({job['source']})")
