// backend/routes/classRoutes.js (create new file)
const express = require('express');
const router = express.Router();
const { scheduleClass, getTeacherClasses,  getStudentClasses, getClassDetails, completeClass } = require('../controllers/classController');
const { verifyClassParticipant, validateClassId } = require('../middleware/classAuth');

router.post('/schedule', scheduleClass);
router.get('/teacher/:teacherId', getTeacherClasses);
router.get('/student/:studentId', getStudentClasses);
router.get('/:classId', getClassDetails);
// router.patch('/:classId/complete', completeClass);
router.patch('/:classId/complete', validateClassId, completeClass);

module.exports = router;