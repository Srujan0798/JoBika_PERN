const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Job = require('./Job');
const Resume = require('./Resume');
const Application = require('./Application');
const ResumeVersion = require('./ResumeVersion');
const SkillGap = require('./SkillGap');
const Notification = require('./Notification');
const UserPreference = require('./UserPreference');

// Define associations
// User associations
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
User.hasMany(ResumeVersion, { foreignKey: 'userId', as: 'resumeVersions' });
User.hasMany(SkillGap, { foreignKey: 'userId', as: 'skillGaps' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasOne(UserPreference, { foreignKey: 'userId', as: 'preferences' });

// Resume associations
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Resume.hasMany(ResumeVersion, { foreignKey: 'baseResumeId', as: 'versions' });
Resume.hasMany(Application, { foreignKey: 'resumeId', as: 'applications' });

// Job associations
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Job.hasMany(ResumeVersion, { foreignKey: 'jobId', as: 'resumeVersions' });
Job.hasMany(SkillGap, { foreignKey: 'jobId', as: 'skillGaps' });

// Application associations
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Application.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

// ResumeVersion associations
ResumeVersion.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ResumeVersion.belongsTo(Resume, { foreignKey: 'baseResumeId', as: 'baseResume' });
ResumeVersion.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// SkillGap associations
SkillGap.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SkillGap.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserPreference associations
UserPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export models and sequelize instance
module.exports = {
    sequelize,
    User,
    Job,
    Resume,
    Application,
    ResumeVersion,
    SkillGap,
    Notification,
    UserPreference
};
