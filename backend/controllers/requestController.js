const StudentRequest = require('../models/StudentRequest');
const TeacherRequest = require('../models/TeacherRequest');
const TeacherDetails = require('../models/TeacherDetails');
const StudentDetails = require('../models/StudentDetails');

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
      preferredDate: req.body.preferredDate,
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

module.exports = {
  createStudentRequest,
  createTeacherRequest,
  getPendingRequests
};