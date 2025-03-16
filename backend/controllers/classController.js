// backend/controllers/classController.js (new file)
const ScheduledClass = require('../models/ScheduledClass');
const ClassRequest = require('../models/ClassRequest');
const StudentDetails = require('../models/StudentDetails');

exports.scheduleClass = async (req, res) => {
  try {
    const { requestId, time } = req.body;
    
    const classRequest = await ClassRequest.findById(requestId)
      .populate('studentId');
    
    // Get the assigned teacher for this subject
    const student = await StudentDetails.findById(classRequest.studentId)
      .populate('subjects.teacherId');
    
    const subjectData = student.subjects.find(s => s.subject === classRequest.subject);
    
    const newScheduledClass = await ScheduledClass.create({
      studentId: classRequest.studentId._id,
      teacherId: subjectData.teacherId._id,
      subject: classRequest.subject,
      date: classRequest.requestedDate,
      time: time,
      status: 'scheduled'
    });

    // Update the original request status
    await ClassRequest.findByIdAndUpdate(requestId, { status: 'approved' });

    res.status(201).json(newScheduledClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
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