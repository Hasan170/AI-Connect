const express = require('express');
const mongoose = require('mongoose');
const { 
  submitAssessmentScore, 
  getStudentScores, 
  getCourseScore 
} = require('../controllers/courseScoreController');

const router = express.Router();

// Add a health check endpoint that shows MongoDB connection status
router.get('/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    mongodb: isConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Submit an assessment score
router.post('/submit', submitAssessmentScore);

// Get all scores for a student
router.get('/student/:studentEmail', getStudentScores);

// Get score for a specific course
router.get('/student/:studentEmail/course/:courseId', getCourseScore);

module.exports = router; 