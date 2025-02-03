const { get } = require('http');
const StudentCredentials = require('../models/StudentCredentials');
const StudentDetails = require('../models/StudentDetails');

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

module.exports = { loginStudent, getStudentDetails };