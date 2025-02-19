const express = require('express');
const { loginStudent, getStudentDetails, createStudent } = require('../controllers/studentController');

const router = express.Router();

router.post('/login', loginStudent);
router.get('/details/:email', getStudentDetails);
router.post('/create', createStudent);

module.exports = router;