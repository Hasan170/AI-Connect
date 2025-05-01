const express = require('express');
const teacherController = require('../controllers/teacherController');

const router = express.Router();

router.post('/login', teacherController.loginTeacher);
router.get('/details/:email', teacherController.getTeacherDetails);
router.get('/details/byid/:id', teacherController.getTeacherById); //added by isra
router.get('/details', teacherController.getAllTeachers);
router.post('/create', teacherController.createTeacher);

module.exports = router;