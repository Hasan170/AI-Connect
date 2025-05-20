const mongoose = require('mongoose');
const StudentRequest = require('../models/StudentRequest'); 
const TeacherRequest = require('../models/TeacherRequest');
const TeacherDetails = require('../models/TeacherDetails');
const StudentDetails = require('../models/StudentDetails');
const ClassRequest = require('../models/ClassRequest');
const SubjectRequest = require('../models/SubjectRequest');

// Handle student class requests
const createStudentRequest = async (req, res) => {
  try {
    const { email } = req.body; // Destructure email from request body

    // Convert email to lowercase
    const normalizedEmail = req.body.email.toLowerCase();

    // Check for existing request
    const existingRequest = await StudentRequest.findOne({ email: normalizedEmail });
    if (existingRequest) {
      return res.status(400).json({ 
        success: false,
        message: "A request from this email already exists." 
      });
    }

    // Check for existing student
    const existingStudent = await StudentDetails.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(400).json({
        success: false, 
        message: "A student with this email is already registered."
      });
    }

    // Create new request with validated data
    const newRequest = new StudentRequest({
      fullName: req.body.fullName,
      email: normalizedEmail,
      grade: req.body.grade,
      subject: req.body.subject,
      board: req.body.board,
    });

    await newRequest.save();
    
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      requestId: newRequest._id
    });

  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Submission failed. Please try again."
    });
  }
};

// Handle tutor applications
const createTeacherRequest = async (req, res) => {
  try {
    const { email } = req.body; // Destructure email from request body

    // Convert email to lowercase
    const normalizedEmail = req.body.email.toLowerCase();

    // Check for existing request
    const existingRequest = await TeacherRequest.findOne({ email: normalizedEmail });
    if (existingRequest) {
      return res.status(400).json({ 
        success: false,
        message: "A request from this email already exists." 
      });
    }

    // Check for existing teacher
    const existingTeacher = await TeacherDetails.findOne({ email: normalizedEmail });
    if (existingTeacher) {
      return res.status(400).json({
        success: false, 
        message: "A teacher with this email is already registered."
      });
    }

    // Create new request with validated data
    const newRequest = new TeacherRequest({
      fullName: req.body.fullName,
      email: normalizedEmail,
      phone: req.body.phone,
      expertise: req.body.expertise,
      experience: req.body.experience,
      qualification: req.body.qualification,
      bio: req.body.bio
    });

    await newRequest.save();
    
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      requestId: newRequest._id
    });

  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Submission failed. Please try again."
    });
  }
};

// Get all pending requests
const getPendingRequests = async (req, res) => {
  try {
    const students = await StudentRequest.find({ status: 'pending' });
    const teachers = await TeacherRequest.find({ status: 'pending' });
    res.json({ students, teachers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createClassRequest = async (req, res) => {
  try {
    // Add request logging
    console.log('Incoming request body:', req.body);

    const { studentId, subject, requestedDate, teacherId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID format' });
    }

    // Convert to ObjectID for comparison
    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

    const student = await StudentDetails.findById(studentId)
      .populate('subjects.teacherId', '_id');

    const hasSubject = student.subjects.some(s => 
      s.subject === subject && 
      s.teacherId._id.equals(teacherObjectId) // Compare ObjectIDs
    );

    // Create request
    const newRequest = await ClassRequest.create({
      studentId,
      subject,
      teacherId, // Add teacherId to the request
      requestedDate: new Date(requestedDate),
      status: 'pending'
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Class request error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

const getPendingClassRequests = async (req, res) => {
  try {
    const requests = await ClassRequest.find({ status: 'pending' })
      .populate('studentId', 'name email grade board')
      .populate('teacherId', 'name'); // Add this line
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentClassRequests = async (req, res) => {
  try {
    const requests = await ClassRequest.find({
      studentId: req.params.studentId
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit new subject request
const createSubjectRequest = async (req, res) => {
  try {
    const { studentId, subject, reason } = req.body;

    // Check if student exists
    const student = await StudentDetails.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for existing pending request for same subject
    const existingRequest = await SubjectRequest.findOne({
      studentId,
      subject,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'Pending request already exists for this subject' 
      });
    }

    // Create new request
    const newRequest = await SubjectRequest.create({
      studentId,
      subject,
      reason
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve subject request
const approveSubjectRequest = async (req, res) => {
  try {
    const { requestId, teacherId } = req.body;

    // Find and validate request
    const request = await SubjectRequest.findById(requestId)
      .populate('studentId');
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Update student's subjects
    await StudentDetails.findByIdAndUpdate(
      request.studentId._id,
      { $addToSet: { 
        subjects: { 
          subject: request.subject,
          teacherId: teacherId 
        } 
      }},
      { new: true }
    );

    // Update request status
    request.status = 'approved';
    request.assignedTeacher = teacherId;
    await request.save();

    res.json({ message: 'Subject added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingSubjectRequests = async (req, res) => {
  try {
    const requests = await SubjectRequest.find({ status: 'pending' })
      .populate({
        path: 'studentId',
        select: 'name email grade board',
        model: 'studentdetail' // Explicitly specify the model
      })
      .sort({ createdAt: -1 });

    console.log('Fetched requests:', requests); // Add logging
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error in getPendingSubjectRequests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch requests',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {createStudentRequest,createTeacherRequest,getPendingRequests, 
  createClassRequest, getPendingClassRequests, getStudentClassRequests, createSubjectRequest, 
  approveSubjectRequest, getPendingSubjectRequests};