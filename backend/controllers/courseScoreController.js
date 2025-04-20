const CourseScore = require('../models/CourseScore');
const StudentDetails = require('../models/StudentDetails');
const mongoose = require('mongoose');

// Fix MongoDB connection by ensuring it's directly connected
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Connecting to MongoDB from courseScoreController...');
    try {
      await mongoose.connect('mongodb://localhost:27017/ai-connect-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected from courseScoreController');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
};

// Submit an assessment score
exports.submitAssessmentScore = async (req, res) => {
  try {
    // Log what we received
    console.log('SUBMISSION DATA:', req.body);

    // Extract fields with NO default values
    const { 
      studentEmail, 
      studentName,
      studentGrade,
      studentBoard,
      studentId,
      courseId, 
      moduleId, 
      assessmentId, 
      assessmentType, 
      score, 
      maxScore,
      courseName,
      percentageScore,
      subject
    } = req.body;

    // Validate all required fields are present
    if (!studentEmail || !courseId || !moduleId || !assessmentId || 
        assessmentType === undefined || score === undefined || maxScore === undefined) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: 'All fields must be provided by the client'
      });
    }

    // VERIFY STUDENT EXISTS - Only allow scores for real students
    const studentExists = await StudentDetails.findOne({ email: studentEmail });
    if (!studentExists) {
      console.error(`Student with email ${studentEmail} not found in database`);
      return res.status(404).json({
        error: 'Student not found',
        message: 'Only registered students can submit quizzes'
      });
    }

    // Create score record using verified student data from database
    const courseScore = new CourseScore({
      studentId: studentExists._id, // Use ID from database
      studentEmail: studentExists.email, // Use email from database
      studentName: studentExists.name, // Use name from database
      studentGrade: studentExists.grade || '',
      studentBoard: studentExists.board || '',
      courseId,
      courseName,
      subject: subject || '',
      percentageScore,
      totalScore: score,
      submissionId: `${studentEmail}-${courseId}-${Date.now()}`,
      assessments: [{
        moduleId,
        assessmentId,
        assessmentType,
        score,
        maxScore,
        submittedAt: Date.now()
      }],
      lastUpdated: Date.now()
    });

    // Save and return response
    const savedScore = await courseScore.save();
    console.log('Score saved successfully with ID:', savedScore._id);

    res.status(200).json({ 
      message: 'Score submitted successfully',
      courseScore: savedScore
    });
  } catch (err) {
    console.error('ERROR in submitAssessmentScore:', err);
    res.status(500).json({ 
      error: 'Server error processing assessment score',
      message: err.message
    });
  }
};

// Get all scores for a student
exports.getStudentScores = async (req, res) => {
  try {
    const { studentEmail } = req.params;
    
    // Find scores by email - simplified pattern like studentController.js
    const scores = await CourseScore.find({ studentEmail });
    
    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get score for a specific course
exports.getCourseScore = async (req, res) => {
  try {
    const { studentEmail, courseId } = req.params;
    
    // Find ALL scores for this student and course (not just the first one)
    const courseScores = await CourseScore.find({ 
      studentEmail, 
      courseId 
    }).sort({ lastUpdated: -1 }); // Sort by newest first
    
    if (courseScores && courseScores.length > 0) {
      // Return all scores as an array
      res.status(200).json(courseScores);
    } else {
      res.status(404).json({ error: 'No course scores found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 