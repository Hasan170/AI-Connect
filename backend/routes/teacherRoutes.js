const express = require('express');
const { signupTeacher, loginTeacher, getTeacherDetails } = require('../controllers/teacherController');

const router = express.Router();

router.post('/signup', signupTeacher);
router.post('/login', loginTeacher);
router.get('/details/:email', getTeacherDetails);

module.exports = router;