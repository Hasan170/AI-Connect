const Feedback = require('../models/Feedback');
const StudentDetails = require('../models/StudentDetails');
const TeacherDetails = require('../models/TeacherDetails');

// Get all feedback for a specific student
const getStudentFeedback = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const feedback = await Feedback.find({ studentId })
      .populate({
        path: 'teacherId',
        model: 'teacherdetail',
        select: 'name expertise'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching student feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get teachers available for feedback for a student
const getTeachersForFeedback = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('Getting teachers for student ID:', studentId);
    
    // Get student details to find assigned teachers
    const student = await StudentDetails.findById(studentId);
    console.log('Student found:', student ? 'Yes' : 'No');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Student subjects:', student.subjects);
    
    // Check if subjects array exists and has elements
    if (!student.subjects || student.subjects.length === 0) {
      console.log('No subjects found for student');
      return res.status(200).json([]); // Return empty array if no subjects
    }
    
    // Extract assigned teacher IDs from student's subjects
    const teacherIds = student.subjects
      .filter(s => s.teacherId)
      .map(s => s.teacherId);
      
    console.log('Teacher IDs found:', teacherIds);
    
    if (teacherIds.length === 0) {
      console.log('No teacher IDs found');
      return res.status(200).json([]); // Return empty array if no teachers
    }
    
    // Get teacher details
    const teachers = await TeacherDetails.find({
      '_id': { $in: teacherIds }
    });
    
    console.log('Teachers found:', teachers.length);
    
    // Find existing feedback for these teachers
    const existingFeedback = await Feedback.find({ 
      studentId, 
      teacherId: { $in: teacherIds },
      feedbackType: 'studentToTutor'
    });
    
    console.log('Existing feedback found:', existingFeedback.length);
    
    // Map teachers with whether they already have feedback
    const teachersWithFeedbackStatus = teachers.map(teacher => {
      const hasFeedback = existingFeedback.some(
        f => f.teacherId.toString() === teacher._id.toString()
      );
      
      return {
        id: teacher._id,
        teacherName: teacher.name,
        expertise: teacher.expertise,
        subjects: student.subjects
          .filter(s => s.teacherId && s.teacherId.toString() === teacher._id.toString())
          .map(s => s.subject),
        status: hasFeedback ? 'submitted' : 'pending',
        // If feedback exists, include the feedback details
        ...(hasFeedback && {
          rating: existingFeedback.find(
            f => f.teacherId.toString() === teacher._id.toString()
          ).rating,
          feedback: existingFeedback.find(
            f => f.teacherId.toString() === teacher._id.toString()
          ).feedback
        })
      };
    });
    
    console.log('Returning teachers with status:', teachersWithFeedbackStatus.length);
    
    res.status(200).json(teachersWithFeedbackStatus);
  } catch (error) {
    console.error('Error fetching teachers for feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get teachers with their feedback status for a student (with multiple feedbacks support)
const getTeachersWithFeedbacks = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('Getting teachers with feedbacks for student ID:', studentId);
    
    // Get student details to find assigned teachers
    const student = await StudentDetails.findById(studentId);
    console.log('Student found:', student ? 'Yes' : 'No');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Student subjects:', student.subjects);
    
    // Check if subjects array exists and has elements
    if (!student.subjects || student.subjects.length === 0) {
      console.log('No subjects found for student');
      return res.status(200).json([]); // Return empty array if no subjects
    }
    
    // Extract assigned teacher IDs from student's subjects
    const teacherIds = student.subjects
      .filter(s => s.teacherId)
      .map(s => s.teacherId);
      
    console.log('Teacher IDs found:', teacherIds);
    
    if (teacherIds.length === 0) {
      console.log('No teacher IDs found');
      return res.status(200).json([]); // Return empty array if no teachers
    }
    
    // Get teacher details
    const teachers = await TeacherDetails.find({
      '_id': { $in: teacherIds }
    });
    
    console.log('Teachers found:', teachers.length);
    
    // Find existing feedbacks for these teachers
    const existingFeedbacks = await Feedback.find({ 
      studentId, 
      teacherId: { $in: teacherIds },
      feedbackType: 'studentToTutor'
    }).sort({ createdAt: -1 });
    
    console.log('Existing feedback found:', existingFeedbacks.length);
    
    // Group feedback by teacher
    const feedbacksByTeacher = {};
    existingFeedbacks.forEach(feedback => {
      const teacherId = feedback.teacherId.toString();
      if (!feedbacksByTeacher[teacherId]) {
        feedbacksByTeacher[teacherId] = [];
      }
      feedbacksByTeacher[teacherId].push({
        id: feedback._id,
        subject: feedback.subject,
        rating: feedback.rating,
        feedback: feedback.feedback,
        createdAt: feedback.createdAt
      });
    });
    
    // Map teachers with their feedbacks
    const teachersWithFeedbackStatus = teachers.map(teacher => {
      const teacherId = teacher._id.toString();
      const teacherFeedbacks = feedbacksByTeacher[teacherId] || [];
      const hasFeedback = teacherFeedbacks.length > 0;
      
      return {
        id: teacherId,
        teacherName: teacher.name,
        expertise: teacher.expertise,
        subjects: student.subjects
          .filter(s => s.teacherId && s.teacherId.toString() === teacherId)
          .map(s => s.subject),
        status: hasFeedback ? 'submitted' : 'pending',
        feedbacks: teacherFeedbacks
      };
    });
    
    console.log('Returning teachers with feedbacks:', teachersWithFeedbackStatus.length);
    
    res.status(200).json(teachersWithFeedbackStatus);
  } catch (error) {
    console.error('Error fetching teachers with feedbacks:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit new feedback
const submitFeedback = async (req, res) => {
    try {
      const { studentId, teacherId, subject, rating, feedback, feedbackType } = req.body;
      
      console.log('Submitting feedback:', req.body);
      
      // Validate required fields
      if (!studentId || !teacherId || !subject || !feedback) {
        return res.status(400).json({ 
          message: 'Missing required fields: studentId, teacherId, subject, and feedback are required' 
        });
      }
      
      // For student-to-tutor feedback, rating is required
      if (feedbackType === 'studentToTutor' && (!rating || rating < 1 || rating > 5)) {
        return res.status(400).json({ 
          message: 'Valid rating (1-5) is required for student-to-tutor feedback' 
        });
      }
  
      // Check if student exists
      const student = await StudentDetails.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Check if teacher exists
      const teacher = await TeacherDetails.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      
      // Create feedback object with required fields
      const feedbackData = {
        studentId,
        teacherId,
        subject,
        feedback,
        status: 'submitted',
        feedbackType: feedbackType || 'studentToTutor'
      };
      
      // Only add rating for studentToTutor feedback type
      if (feedbackType !== 'tutorToStudent') {
        feedbackData.rating = rating;
      }
      
      // Create new feedback
      const newFeedback = new Feedback(feedbackData);
      
      await newFeedback.save();
      
      res.status(201).json({ 
        message: 'Feedback submitted successfully',
        feedback: newFeedback
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ message: error.message });
    }
  };

// Get all feedback for admin
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate({ 
        path: 'studentId', 
        model: 'studentdetail',
        select: 'name email'
      })
      .populate({
        path: 'teacherId',
        model: 'teacherdetail',
        select: 'name email expertise'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentFeedback,
  getTeachersForFeedback,
  getTeachersWithFeedbacks,
  submitFeedback,
  getAllFeedback
};