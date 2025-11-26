from flask_mail import Mail, Message
import os
from datetime import datetime

# Mail instance (will be initialized in server.py)
mail = None

def init_mail(app):
    """Initialize Flask-Mail with app"""
    global mail
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('GMAIL_USER', 'your-email@gmail.com')
    app.config['MAIL_PASSWORD'] = os.getenv('GMAIL_APP_PASSWORD', 'your-app-password')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('GMAIL_USER', 'your-email@gmail.com')
    
    from flask_mail import Mail
    mail = Mail(app)
    return mail

def send_welcome_email(user_email, user_name):
    """Send welcome email to new user"""
    try:
        msg = Message(
            '🎉 Welcome to JoBika - Your AI Job Application Assistant!',
            recipients=[user_email]
        )
        
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to JoBika!</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>🎉 Your account has been created successfully! Welcome to JoBika - your AI-powered job application assistant.</p>
                    
                    <h3>What's Next?</h3>
                    <ol>
                        <li><strong>Upload Your Resume</strong> - Let our AI parse and enhance it</li>
                        <li><strong>Browse Jobs</strong> - Find perfect matches based on your skills</li>
                        <li><strong>Apply with One Click</strong> - Track all your applications in one place</li>
                    </ol>
                    
                    <p>Our AI will help you:</p>
                    <ul>
                        <li>✅ Enhance your resume with better action verbs</li>
                        <li>✅ Match you with relevant jobs (85%+ accuracy)</li>
                        <li>✅ Track your applications effortlessly</li>
                        <li>✅ Get skill recommendations</li>
                    </ul>
                    
                    <a href="http://localhost:5000" class="button">Get Started</a>
                    
                    <p>If you have any questions, feel free to reply to this email.</p>
                    
                    <p>Best regards,<br>
                    The JoBika Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 JoBika. All rights reserved.</p>
                    <p>You received this email because you signed up for JoBika.</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        if mail:
            mail.send(msg)
            return True
        return False
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False

def send_application_confirmation(user_email, user_name, job_title, company, match_score):
    """Send application confirmation email"""
    try:
        msg = Message(
            f'✅ Application Submitted: {job_title} at {company}',
            recipients=[user_email]
        )
        
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .job-card {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }}
                .match-score {{ display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ Application Submitted!</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>Great news! Your application has been successfully submitted.</p>
                    
                    <div class="job-card">
                        <h3>{job_title}</h3>
                        <p><strong>Company:</strong> {company}</p>
                        <p><strong>Match Score:</strong> <span class="match-score">{match_score}%</span></p>
                        <p><strong>Submitted:</strong> {datetime.now().strftime("%B %d, %Y at %I:%M %p")}</p>
                    </div>
                    
                    <h3>What Happens Next?</h3>
                    <ol>
                        <li>The company will review your application</li>
                        <li>We'll notify you of any status updates</li>
                        <li>Keep track in your Application Tracker</li>
                    </ol>
                    
                    <p><strong>Pro Tips:</strong></p>
                    <ul>
                        <li>🔔 Check your email regularly for updates</li>
                        <li>📊 Monitor your application status in the dashboard</li>
                        <li>🎯 Continue applying to similar roles</li>
                    </ul>
                    
                    <p>Good luck! We're rooting for you! 🚀</p>
                    
                    <p>Best regards,<br>
                    The JoBika Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 JoBika. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        if mail:
            mail.send(msg)
            return True
        return False
    except Exception as e:
        print(f"Error sending application confirmation: {e}")
        return False

def send_job_alert(user_email, user_name, new_jobs):
    """Send email alert for new matching jobs"""
    try:
        msg = Message(
            f'🔔 {len(new_jobs)} New Jobs Match Your Profile!',
            recipients=[user_email]
        )
        
        jobs_html = ''
        for job in new_jobs[:5]:  # Limit to 5 jobs
            jobs_html += f'''
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #667eea;">
                <h4 style="margin: 0 0 10px 0;">{job.get('title', 'Job Title')}</h4>
                <p style="margin: 5px 0;"><strong>Company:</strong> {job.get('company', 'Company')}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> {job.get('location', 'Location')}</p>
                <p style="margin: 5px 0;"><strong>Match Score:</strong> <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold;">{job.get('match_score', 85)}%</span></p>
            </div>
            '''
        
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 New Jobs for You!</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>We found <strong>{len(new_jobs)} new jobs</strong> that match your profile!</p>
                    
                    <h3>Top Matches:</h3>
                    {jobs_html}
                    
                    <a href="http://localhost:5000/jobs.html" class="button">View All Jobs</a>
                    
                    <p>Don't miss out on these opportunities! Apply now to increase your chances.</p>
                    
                    <p>Best regards,<br>
                    The JoBika Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 JoBika. All rights reserved.</p>
                    <p>You can manage your email preferences in your account settings.</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        if mail:
            mail.send(msg)
            return True
        return False
    except Exception as e:
        print(f"Error sending job alert: {e}")
        return False

def send_skill_recommendation_email(user_email, user_name, recommendations):
    """Send skill gap recommendations email"""
    try:
        msg = Message(
            '📚 Skill Recommendations to Boost Your Profile',
            recipients=[user_email]
        )
        
        skills_html = ''
        for rec in recommendations[:5]:  # Limit to 5 recommendations
            priority_color = '#ef4444' if rec.get('priority') == 'high' else '#f59e0b'
            skills_html += f'''
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid {priority_color};">
                <h4 style="margin: 0 0 10px 0;">{rec.get('skill', 'Skill')}</h4>
                <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="color: {priority_color}; text-transform: uppercase; font-weight: bold;">{rec.get('priority', 'medium')}</span></p>
                <p style="margin: 5px 0;"><strong>Why learn this:</strong> {rec.get('reason', 'In high demand')}</p>
                <p style="margin: 5px 0;"><strong>Resources:</strong> {rec.get('resources', 'Check online courses')}</p>
            </div>
            '''
        
        msg.html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 Skill Recommendations</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>Based on your resume and current job market trends, here are some skills that could boost your profile:</p>
                    
                    {skills_html}
                    
                    <p><strong>Why upskill?</strong></p>
                    <ul>
                        <li>📈 Increase your match scores</li>
                        <li>💼 Access more job opportunities</li>
                        <li>💰 Command higher salaries</li>
                        <li>🚀 Stay competitive in the market</li>
                    </ul>
                    
                    <p>Start learning today and watch your opportunities grow!</p>
                    
                    <p>Best regards,<br>
                    The JoBika Team</p>
                </div>
                <div class="footer">
                    <p>© 2025 JoBika. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        if mail:
            mail.send(msg)
            return True
        return False
    except Exception as e:
        print(f"Error sending skill recommendations: {e}")
        return False
