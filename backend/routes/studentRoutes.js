const express = require('express');
const { signupStudent, loginStudent, getStudentDetails } = require('../controllers/studentController');

const router = express.Router();

router.post('/signup', signupStudent);
router.post('/login', loginStudent);
router.get('/details/:email', getStudentDetails);

module.exports = router;