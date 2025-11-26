# Add new endpoint for job scraping
@app.route('/api/jobs/scrape', methods=['POST'])
def scrape_jobs():
    """Scrape fresh jobs from job boards"""
    data = request.json
    query = data.get('query', 'software developer')
    location = data.get('location', 'bangalore')
    limit = data.get('limit', 5)
    
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
        'added': added_count
    })

# Add endpoint for skill recommendations
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
