const mongoose = require('mongoose');

const assessmentScoreSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  assessmentId: { type: String, required: true },
  assessmentType: { 
    type: String, 
    required: true, 
    enum: ['quiz', 'assignment', 'project'] 
  },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const courseScoreSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'studentdetail'
  },
  studentEmail: { 
    type: String, 
    required: true,
    index: true
  },
  studentName: {
    type: String,
    default: 'Unknown Student'
  },
  studentGrade: {
    type: String,
    default: ''
  },
  studentBoard: {
    type: String,
    default: ''
  },
  courseId: { type: String, required: true },
  courseName: { type: String, default: 'Unknown Course' },
  percentageScore: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  submissionId: { type: String, index: true },
  assessments: [assessmentScoreSchema],
  lastUpdated: { type: Date, default: Date.now },
  submissionDate: { type: Date, default: Date.now }
});

// Create NON-UNIQUE indexes for faster lookups
courseScoreSchema.index({ studentEmail: 1, courseId: 1 });
courseScoreSchema.index({ submissionDate: -1 }); // For sorting by newest first

module.exports = mongoose.model('coursescore', courseScoreSchema); 