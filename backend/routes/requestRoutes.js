const express = require('express');
const { createStudentRequest, createTeacherRequest, getPendingRequests , createClassRequest, 
    getPendingClassRequests, getStudentClassRequests, createSubjectRequest, approveSubjectRequest,
    getPendingSubjectRequests } = require('../controllers/requestController');

const router = express.Router();

router.post('/student', createStudentRequest);
router.post('/teacher', createTeacherRequest);
router.get('/pending', getPendingRequests);


router.post('/class', createClassRequest);
router.get('/class/pending', getPendingClassRequests);
router.get('/student/:studentId', getStudentClassRequests);

router.post('/subject', createSubjectRequest);
router.get('/subject/pending', getPendingSubjectRequests);
router.post('/subject/approve', approveSubjectRequest);

module.exports = router;


