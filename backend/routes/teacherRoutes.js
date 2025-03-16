const express = require('express');
const { loginTeacher, getTeacherDetails, createTeacher, getAllTeachers } = require('../controllers/teacherController');

const router = express.Router();

router.post('/login', loginTeacher);
router.get('/details/:email', getTeacherDetails);
router.get('/details', getAllTeachers);
router.post('/create', createTeacher);

module.exports = router;

