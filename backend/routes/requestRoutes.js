const express = require('express');
const { createStudentRequest, createTeacherRequest, getPendingRequests , createClassRequest, 
    getPendingClassRequests, getStudentClassRequests } = require('../controllers/requestController');

const router = express.Router();

router.post('/student', createStudentRequest);
router.post('/teacher', createTeacherRequest);
router.get('/pending', getPendingRequests);


router.post('/class', createClassRequest);
router.get('/class/pending', getPendingClassRequests);
router.get('/student/:studentId', getStudentClassRequests);

module.exports = router;


