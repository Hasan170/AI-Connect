// backend/middleware/classAuth.js
const mongoose = require('mongoose');

exports.verifyClassParticipant = async (req, res, next) => {
    try {
      const classId = req.params.classId;
      const userId = req.user.id; // Assuming you have authentication setup
      
      const scheduledClass = await ScheduledClass.findById(classId)
        .populate('studentId teacherId');
      
      if (![scheduledClass.studentId._id, scheduledClass.teacherId._id].includes(userId)) {
        return res.status(403).json({ message: 'Not authorized for this class' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.validateClassId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class ID format'
      });
    }
    next();
  };