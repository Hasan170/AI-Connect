const express = require('express');
const { loginTeacher, getTeacherDetails, createTeacher } = require('../controllers/teacherController');

const router = express.Router();

router.post('/login', loginTeacher);
router.get('/details/:email', getTeacherDetails);
router.post('/create', createTeacher);

module.exports = router;

