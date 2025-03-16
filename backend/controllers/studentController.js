const { get } = require('http');
const StudentCredentials = require('../models/StudentCredentials');
const StudentDetails = require('../models/StudentDetails');
const StudentRequest = require('../models/StudentRequest');

// Login for students
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await StudentCredentials.findOne({ email, password });
    if (student) {
      res.status(200).json({ message: 'Student logged in successfully', student });
    } else {
      res.status(404).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
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

module.exports = { loginStudent, getStudentDetails, createStudent };