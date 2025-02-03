const express = require('express');
const { loginTeacher, getTeacherDetails } = require('../controllers/teacherController');

const router = express.Router();

router.post('/login', loginTeacher);
router.get('/details/:email', getTeacherDetails);

module.exports = router;