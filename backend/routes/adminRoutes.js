const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Add admin authentication middleware if you have one
// router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

// Stats routes
router.get('/stats/tutors', adminController.getTutorStats);
router.get('/stats/students', adminController.getStudentStats);
router.get('/stats/active-classes', adminController.getActiveClassStats);



module.exports = router;