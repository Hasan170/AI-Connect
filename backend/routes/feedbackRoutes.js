const express = require('express');
const { 
  getStudentFeedback, 
  getTeachersForFeedback, 
  submitFeedback, 
  getAllFeedback,
  getTeachersWithFeedbacks // Add this import
} = require('../controllers/feedbackController');
const router = express.Router();

// Get all feedback for a specific student
router.get('/student/:studentId', getStudentFeedback);

// Get teachers available for feedback for a student
router.get('/student/:studentId/teachers', getTeachersForFeedback);

// Submit new feedback
router.post('/submit', submitFeedback);

// Get all feedback (for admin)
router.get('/all', getAllFeedback);

// Get teachers with all their feedbacks for a student
router.get('/student/:studentId/teachers-with-feedbacks', getTeachersWithFeedbacks);

module.exports = router;