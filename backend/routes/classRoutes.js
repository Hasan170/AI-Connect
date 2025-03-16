// backend/routes/classRoutes.js (create new file)
const express = require('express');
const router = express.Router();
const { scheduleClass, getTeacherClasses,  getStudentClasses } = require('../controllers/classController');

router.post('/schedule', scheduleClass);
router.get('/teacher/:teacherId', getTeacherClasses);
router.get('/student/:studentId', getStudentClasses);

module.exports = router;