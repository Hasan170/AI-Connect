const TeacherDetails = require('../models/TeacherDetails');
const StudentDetails = require('../models/StudentDetails');
const ScheduledClass = require('../models/ScheduledClass');

// Get count of all tutors (modified to return all tutors, not just approved ones)
exports.getTutorStats = async (req, res) => {
  try {
    console.log('[ADMIN] Fetching tutor statistics');
    
    // Count all tutors instead of filtering by approval status
    const count = await TeacherDetails.countDocuments();
    
    console.log(`[ADMIN] Found ${count} tutors in total`);
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('[ADMIN ERROR] Error fetching tutor statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutor statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get count of all students
exports.getStudentStats = async (req, res) => {
  try {
    const count = await StudentDetails.countDocuments();
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching student statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get count of active classes (scheduled but not completed)
exports.getActiveClassStats = async (req, res) => {
  try {
    const count = await ScheduledClass.countDocuments({ status: 'scheduled' });
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching active class statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active class statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};