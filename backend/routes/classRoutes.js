// backend/routes/classRoutes.js (create new file)
const express = require('express');
const router = express.Router();
const { scheduleClass, getTeacherClasses,  getStudentClasses, getClassDetails } = require('../controllers/classController');
// const { verifyClassParticipant } = require('../middleware/classAuth');

router.post('/schedule', scheduleClass);
router.get('/teacher/:teacherId', getTeacherClasses);
router.get('/student/:studentId', getStudentClasses);
router.get('/:classId', getClassDetails);

module.exports = router;