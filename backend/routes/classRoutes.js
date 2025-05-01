// backend/routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { verifyClassParticipant, validateClassId } = require('../middleware/classAuth');

router.post('/schedule', classController.scheduleClass);
router.get('/teacher/:teacherId', classController.getTeacherClasses);
router.get('/student/:studentId', classController.getStudentClasses);
router.get('/:classId', classController.getClassDetails);
router.get('/teacher/:teacherId/students', classController.getTeacherStudents); // added by isra
// router.patch('/:classId/complete', classController.completeClass);
router.patch('/:classId/complete', validateClassId, classController.completeClass);

module.exports = router;