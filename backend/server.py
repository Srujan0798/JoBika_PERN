# JoBika Backend Server
# Python Flask + SQLite Implementation
# Enhanced with PDF parsing, job scraping, and improved AI

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
import os
import json
from werkzeug.utils import secure_filename
import re

    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT a.*, j.title, j.company, j.location
                 FROM applications a
                 JOIN jobs j ON a.job_id = j.id
                 WHERE a.user_id = ?
                 ORDER BY a.applied_at DESC''', (user_id,))
    applications = c.fetchall()
    conn.close()
    
    result = []
    for app in applications:
        result.append({
            'id': app['id'],
            'jobId': app['job_id'],
            'position': app['title'],
            'company': app['company'],
            'location': app['location'],
            'status': app['status'],
            'matchScore': app['match_score'],
            'appliedDate': app['applied_at']
        })
    
    return jsonify(result)

# Seed database with sample jobs
@app.route('/api/seed', methods=['POST'])
def seed_database():
    """Seed database with sample jobs"""
    conn = get_db()
    c = conn.cursor()
    
    # Check if jobs already exist
    c.execute('SELECT COUNT(*) as count FROM jobs')
    if c.fetchone()['count'] > 0:
        conn.close()
        return jsonify({'message': 'Database already seeded'})
    
    sample_jobs = [
        {
            'title': 'Senior Full-Stack Developer',
            'company': 'Google India',
            'location': 'Bangalore',
            'salary': '₹25-35 LPA',
            'description': 'Looking for experienced full-stack developer',
            'skills': json.dumps(['React', 'Node.js', 'TypeScript', 'AWS']),
            'posted_date': '2 days ago',
            'source': 'LinkedIn'
        },
        {
            'title': 'AI/ML Engineer',
            'company': 'Microsoft',
            'location': 'Hyderabad',
            'salary': '₹30-40 LPA',
            'description': 'Work on cutting-edge AI projects',
            'skills': json.dumps(['Python', 'TensorFlow', 'PyTorch', 'ML']),
            'posted_date': '1 week ago',
            'source': 'Naukri'
        },
        {
            'title': 'Frontend Developer',
            'company': 'Flipkart',
            'location': 'Bangalore',
            'salary': '₹15-20 LPA',
            'description': 'Build amazing user interfaces',
            'skills': json.dumps(['React', 'JavaScript', 'CSS', 'Redux']),
            'posted_date': '3 days ago',
            'source': 'Company Website'
        },
        {
            'title': 'Backend Engineer',
            'company': 'Amazon',
            'location': 'Mumbai',
            'salary': '₹20-28 LPA',
            'description': 'Scale backend systems',
            'skills': json.dumps(['Java', 'Spring Boot', 'Microservices', 'AWS']),
            'posted_date': '5 days ago',
            'source': 'LinkedIn'
        },
        {
            'title': 'DevOps Engineer',
            'company': 'Zomato',
            'location': 'Gurugram',
            'salary': '₹18-25 LPA',
            'description': 'Manage cloud infrastructure',
            'skills': json.dumps(['Docker', 'Kubernetes', 'CI/CD', 'AWS']),
            'posted_date': '1 week ago',
            'source': 'Unstop'
        },
        {
            'title': 'Data Scientist',
            'company': 'Swiggy',
            'location': 'Bangalore',
            'salary': '₹22-30 LPA',
            'description': 'Analyze data and build models',
            'skills': json.dumps(['Python', 'SQL', 'Machine Learning', 'Statistics']),
            'posted_date': '4 days ago',
            'source': 'Naukri'
        }
    ]
    
    for job in sample_jobs:
        c.execute('''INSERT INTO jobs (title, company, location, salary, description, required_skills, posted_date, source)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                  (job['title'], job['company'], job['location'], job['salary'],
                   job['description'], job['skills'], job['posted_date'], job['source']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Database seeded with sample jobs'})

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'JoBika API is running'})

# Job scraping endpoint
@app.route('/api/jobs/scrape', methods=['POST'])
def scrape_jobs_endpoint():
    """Scrape fresh jobs from job boards"""
    data = request.json or {}
    query = data.get('query', 'software developer')
    location = data.get('location', 'bangalore')
    limit = data.get('limit', 5)
    
    try:
        # Scrape jobs
        scraped_jobs = scrape_all_jobs(query, location, limit)
        
        # Store in database
        conn = get_db()
        c = conn.cursor()
        
        added_count = 0
        for job in scraped_jobs:
            # Extract skills from description
            skills = extract_skills_from_job(job.get('description', ''))
            
            # Check if job already exists
            c.execute('SELECT id FROM jobs WHERE title = ? AND company = ?',
                      (job['title'], job['company']))
            if c.fetchone():
                continue  # Skip duplicates
            
            c.execute('''INSERT INTO jobs (title, company, location, salary, description, required_skills, posted_date, source)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                      (job['title'], job['company'], job['location'], job.get('salary', 'Not disclosed'),
                       job.get('description', ''), json.dumps(skills), job.get('posted_date', 'Recently'), job['source']))
            added_count += 1
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'Scraped {len(scraped_jobs)} jobs, added {added_count} new jobs',
            'scraped': len(scraped_jobs),
            'added': added_count,
            'jobs': scraped_jobs
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Skill recommendations endpoint
@app.route('/api/resume/<int:resume_id>/recommendations', methods=['GET'])
def get_recommendations(resume_id):
    """Get skill recommendations based on resume and target jobs"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db()
    c = conn.cursor()
    
    # Get resume skills
    c.execute('SELECT skills FROM resumes WHERE id = ? AND user_id = ?', (resume_id, user_id))
    resume = c.fetchone()
    
    if not resume:
        conn.close()
        return jsonify({'error': 'Resume not found'}), 404
    
    resume_skills = json.loads(resume['skills']) if resume['skills'] else []
    
    # Get top jobs and their skills
    c.execute('SELECT required_skills FROM jobs ORDER BY created_at DESC LIMIT 10')
    jobs = c.fetchall()
    conn.close()
    
    # Aggregate all job skills
    all_job_skills = set()
    for job in jobs:
        if job['required_skills']:
            skills = json.loads(job['required_skills'])
            all_job_skills.update(skills)
    
    # Generate recommendations
    recommendations = generate_skill_recommendations(resume_skills, list(all_job_skills))
    
    return jsonify({
        'currentSkills': resume_skills,
        'recommendations': recommendations
    })

# Serve frontend
@app.route('/')
def serve_frontend():
    return send_from_directory('../app', 'index.html')

if __name__ == '__main__':
    init_db()
    print("="*50)
    print("JoBika Backend Server Starting...")
    print("="*50)
    print("Server running on: http://localhost:5000")
    print("API endpoints available at: http://localhost:5000/api/")
    print("\nTo seed database with sample jobs:")
    print("POST http://localhost:5000/api/seed")
    print("="*50)
    app.run(debug=True, port=5000)
