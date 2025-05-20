// backend/controllers/classController.js (new file)
const mongoose = require('mongoose');
const crypto = require('crypto');
const ScheduledClass = require('../models/ScheduledClass');
const ClassRequest = require('../models/ClassRequest');
const StudentDetails = require('../models/StudentDetails');

exports.completeClass = async (req, res) => {
  try {
    const { classId } = req.params;

    console.log('[COMPLETE CLASS] Marking class as completed:', classId);

    // Add status validation
    const existingClass = await ScheduledClass.findById(classId);
    if (!existingClass) {
      console.log('[COMPLETE CLASS] Class not found:', classId);
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    if (existingClass.status === 'completed') {
      console.log('[COMPLETE CLASS] Class already completed:', classId);
      return res.status(400).json({
        success: false,
        message: 'Class already completed'
      });
    }

    // Validate class ID format
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid class ID format' 
      });
    }

    const updatedClass = await ScheduledClass.findByIdAndUpdate(
      classId,
      { 
        status: 'completed',
        fees: 'Not paid'  // Set fees to Not paid when class is completed
      },
      { new: true, runValidators: true }
    ).populate('studentId teacherId', 'name email');

    if (!updatedClass) {
      console.log('[COMPLETE CLASS] Failed to update class:', classId);
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    console.log('[COMPLETE CLASS] Successfully updated class:', {
      id: updatedClass._id,
      status: updatedClass.status,
      fees: updatedClass.fees
    });

    res.status(200).json({
      success: true,
      data: updatedClass
    });

  } catch (error) {
    console.error('[COMPLETE CLASS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete class',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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
    // const meetingId = `class-${classRequest._id}-${Date.now()}`;
    const randomString = crypto.randomBytes(12).toString('hex');
    const meetingId = `private-${classRequest._id}-${Date.now()}-${randomString}`;
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

// ===== added by isra =====
// Get all students assigned to a teacher (directly from subject assignments, not class schedules)
exports.getTeacherStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid teacher ID format' 
      });
    }

    // Find all students where this teacher is assigned to any subject
    const students = await StudentDetails.find({
      'subjects.teacherId': teacherId
    }).select('_id name grade subjects');
    
    if (!students || students.length === 0) {
      return res.json([]);
    }

    // Process students to include only relevant details
    const formattedStudents = students.map(student => {
      // Filter subjects to only those taught by this teacher
      const teacherSubjects = student.subjects
        .filter(subject => subject.teacherId && subject.teacherId.toString() === teacherId)
        .map(subject => subject.subject);
      
      return {
        _id: student._id,
        name: student.name,
        grade: student.grade || 'N/A',
        subjects: teacherSubjects
      };
    });

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error('[GET TEACHER STUDENTS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students assigned to teacher',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUnpaidFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    console.log('[GET UNPAID FEES] Received request for studentId:', studentId);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid student ID format' 
      });
    }

    // First check if the studentId exists
    const studentExists = await mongoose.model('studentdetail').findById(studentId);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find all completed classes with unpaid fees
    // Use case-insensitive query for the fees field to handle any case mismatches
    const unpaidClasses = await ScheduledClass.find({
      studentId: studentId,
      status: 'completed',
      $or: [
        { fees: 'Not paid' },
        { fees: 'not paid' },
        { fees: 'NOT PAID' },
        { fees: null }  // Also include if fees field is null
      ]
    });
    
    console.log('[GET UNPAID FEES] Found unpaid classes:', unpaidClasses.length);
    
    // Log each unpaid class for debugging
    unpaidClasses.forEach((cls, index) => {
      console.log(`[GET UNPAID FEES] Class ${index + 1}:`, {
        id: cls._id,
        status: cls.status,
        fees: cls.fees,
        date: cls.date
      });
    });

    // Calculate total due (Rs 500 per class)
    const classFee = 500;
    const totalDue = unpaidClasses.length * classFee;
    const unpaidClassIds = unpaidClasses.map(cls => cls._id);

    const responseData = {
      unpaidClassCount: unpaidClasses.length,
      totalDue: totalDue,
      unpaidClassIds: unpaidClassIds,
      feePerClass: classFee
    };
    
    console.log('[GET UNPAID FEES] Response data:', responseData);

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('[GET UNPAID FEES ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unpaid fees',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add new function to mark fees as paid
exports.markFeesAsPaid = async (req, res) => {
  try {
    const { classIds } = req.body;
    
    if (!Array.isArray(classIds) || classIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class IDs provided'
      });
    }

    // Validate all class IDs
    for (const id of classIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid class ID format: ${id}`
        });
      }
    }

    // Update all specified classes
    const result = await ScheduledClass.updateMany(
      { _id: { $in: classIds } },
      { fees: 'Paid' }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} classes marked as paid`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('[MARK FEES PAID ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark fees as paid',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};