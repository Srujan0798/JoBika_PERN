const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    salary: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    source: {
        type: String, // 'linkedin', 'indeed', etc.
        required: true,
    },
    matchScore: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Job', JobSchema);
