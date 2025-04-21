const express = require('express');
const { loginStudent, getStudentDetails, findStudentByEmail, createStudent } = require('../controllers/studentController');

const router = express.Router();

router.post('/login', loginStudent);
router.get('/details/:email', getStudentDetails);
router.get('/find/:email', findStudentByEmail);
router.post('/create', createStudent);

module.exports = router;