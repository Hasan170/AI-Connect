const express = require('express');
const {
  createStudentRequest,
  createTeacherRequest,
  getPendingRequests
} = require('../controllers/requestController');

const router = express.Router();

router.post('/student', createStudentRequest);
router.post('/teacher', createTeacherRequest);
router.get('/pending', getPendingRequests);

module.exports = router;