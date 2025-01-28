const express = require('express');
const { signupTeacher, loginTeacher } = require('../controllers/teacherController');

const router = express.Router();

router.post('/signup', signupTeacher);
router.post('/login', loginTeacher);

module.exports = router;