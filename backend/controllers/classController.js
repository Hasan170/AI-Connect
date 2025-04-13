// backend/controllers/classController.js (new file)
const mongoose = require('mongoose');
const ScheduledClass = require('../models/ScheduledClass');
const ClassRequest = require('../models/ClassRequest');
const StudentDetails = require('../models/StudentDetails');

exports.scheduleClass = async (req, res) => {
  try {
    const { requestId, time } = req.body;

    // 1. Find the class request with proper validation
    const classRequest = await ClassRequest.findById(requestId)
      .populate('studentId')
      .populate('teacherId');
    
    if (!classRequest) {
      return res.status(404).json({ message: 'Class request not found' });
    }

    // 2. Get student details with proper error handling
    const student = await StudentDetails.findById(classRequest.studentId._id)
      .populate('subjects.teacherId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 3. Find the subject with validation
    const subjectData = student.subjects.find(s => s.subject === classRequest.subject);
    if (!subjectData?.teacherId) {
      return res.status(400).json({ 
        message: 'No teacher assigned for this subject' 
      });
    }

    // 4. Create meeting ID and link first
    const meetingId = `class-${classRequest._id}-${Date.now()}`;
    const meetingLink = `https://meet.jit.si/${meetingId}`;

    // 5. Create scheduled class with proper date handling
    const newScheduledClass = await ScheduledClass.create({
      studentId: classRequest.studentId._id,
      teacherId: subjectData.teacherId._id,
      subject: classRequest.subject,
      date: new Date(classRequest.requestedDate),
      time: time,
      status: 'scheduled',
      meetingLink,
      meetingId
    });

    // 6. Update class request status
    await ClassRequest.findByIdAndUpdate(requestId, { 
      status: 'approved',
      scheduledClassId: newScheduledClass._id 
    });

    res.status(201).json(newScheduledClass);

  } catch (error) {
    console.error('[SCHEDULE ERROR]', error);
    res.status(500).json({ 
      message: 'Scheduling failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await ScheduledClass.find({ 
      teacherId: req.params.teacherId,
      status: 'scheduled'
    }).populate('studentId', 'name email grade');
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentClasses = async (req, res) => {
  try {
    const classes = await ScheduledClass.find({
      studentId: req.params.studentId,
      status: 'scheduled'
    }).populate('teacherId', 'name');
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }

    const classDetails = await ScheduledClass.findById(req.params.classId)
      .populate('studentId', 'name email')
      .populate('teacherId', 'name email');

    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      success: true,
      data: {
        meetingId: classDetails.meetingId,
        subject: classDetails.subject,
        date: classDetails.date,
        time: classDetails.time
      }
    });

  } catch (error) {
    console.error('[CLASS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};