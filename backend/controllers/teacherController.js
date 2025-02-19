const bcrypt = require('bcrypt');
const TeacherCredentials = require('../models/TeacherCredentials');
const TeacherDetails = require('../models/TeacherDetails');
const TeacherRequest = require('../models/TeacherRequest'); // Add this line

// Login for teachers
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await TeacherCredentials.findOne({ email, password });
    if (teacher) {
      res.status(200).json({ message: 'Teacher logged in successfully', teacher });
    } else {
      res.status(404).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch teacher details by email
const getTeacherDetails = async (req, res) => {
  const { email } = req.params; // Get the email from the URL parameter
  try {
    const teacher = await TeacherDetails.findOne({ email }); // Find the teacher by email
    if (teacher) {
      res.status(200).json(teacher); // Return the teacher details
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

// Create teacher credentials & details (Admin Action)
const createTeacher = async (req, res) => {
  try {
    const { requestId, name, email, expertise, experience, qualification,  password } = req.body;

    // Save teacher credentials (for login)
    const teacherCredentials = new TeacherCredentials({
      email,
      password
    });

    // Save teacher details (for profile)
    const teacherDetails = new TeacherDetails({
      name,
      email,
      expertise,
      experience,
      qualification
    });

    // Save both documents in MongoDB
    await teacherCredentials.save();
    await teacherDetails.save();

    if (!requestId) {
      console.log("❌ Missing requestId! Received:", req.body); // Debugging log
      return res.status(400).json({ message: 'Missing rrequest ID' });
    }
    // Delete the pending request using the requestId
    await TeacherRequest.findByIdAndDelete(requestId);

    res.status(201).json({ message: 'Teacher credentials and details created successfully' });

  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginTeacher, getTeacherDetails, createTeacher };