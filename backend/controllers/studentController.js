const { get } = require('http');
const StudentCredentials = require('../models/StudentCredentials');
const StudentDetails = require('../models/StudentDetails');
const StudentRequest = require('../models/StudentRequest');

// Login for students
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    // First verify credentials
    const studentCred = await StudentCredentials.findOne({ email, password });
    if (!studentCred) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    // Fetch complete student details to return to the client
    const studentDetails = await StudentDetails.findOne({ email });
    if (!studentDetails) {
      // This should not happen if the database is consistent
      return res.status(500).json({ 
        error: 'Student details not found for authenticated user',
        message: 'Database inconsistency detected'
      });
    }

    // Return the complete student information
    res.status(200).json({ 
      message: 'Student logged in successfully', 
      student: {
        id: studentDetails._id,
        email: studentDetails.email,
        name: studentDetails.name,
        grade: studentDetails.grade,
        board: studentDetails.board,
        subjects: studentDetails.subjects
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch student details by email
const getStudentDetails = async (req, res) => {
  const { email } = req.params; // Get the email from the URL parameter
  try {
    const student = await StudentDetails.findOne({ email }); // Find the student by email
    if (student) {
      res.status(200).json(student); // Return the student details
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

// Verify if a student exists (useful for debugging)
const findStudentByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }
  
  try {
    // Try exact match first
    let student = await StudentDetails.findOne({ email });
    
    // If not found, try case-insensitive match
    if (!student) {
      const normalizedEmail = email.toLowerCase().trim();
      student = await StudentDetails.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
      });
    }
    
    // List all students in database to help debug
    const allStudents = await StudentDetails.find({}, 'email name');
    
    if (student) {
      res.status(200).json({ 
        found: true, 
        student,
        message: 'Student found in database',
        allStudents
      });
    } else {
      res.status(404).json({ 
        found: false, 
        message: 'Student not found in database',
        searchedEmail: email,
        allStudents
      });
    }
  } catch (err) {
    console.error('Error finding student:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create student credentials & details (Admin Action)
const createStudent = async (req, res) => {
  try {
    const { requestId, name, grade, board, subjects, email,  password } = req.body;

      // Ensure subjects is properly formatted
      const subjectsArray = Array.isArray(subjects)
      ? subjects.map(({ subject, teacherId }) => ({ subject, teacherId })) // ✅ Extract correctly
      : [];

    // Save student credentials (for login)
    const studentCredentials = new StudentCredentials({
      email,
      password
    });

    // Save student details (for profile)
    const studentDetails = new StudentDetails({
      email,
      name,
      grade,
      board,
      subjects: subjectsArray
    });

    // Save both documents in MongoDB
    await studentDetails.save();
    await studentCredentials.save();

    if (!requestId) {
      console.log("❌ Missing requestId! Received:", req.body); // Debugging log
      return res.status(400).json({ message: 'Missing rrequest ID' });
    }
    // Delete the pending request using the requestId
    await StudentRequest.findByIdAndDelete(requestId);

    res.status(201).json({ message: 'Student credentials and details created successfully' });

  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error' });
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


module.exports = { loginStudent, getStudentDetails, findStudentByEmail, createStudent, approveSubjectRequest };