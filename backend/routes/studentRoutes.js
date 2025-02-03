const express = require('express');
const { loginStudent, getStudentDetails } = require('../controllers/studentController');

const router = express.Router();

router.post('/login', loginStudent);
router.get('/details/:email', getStudentDetails);

module.exports = router;