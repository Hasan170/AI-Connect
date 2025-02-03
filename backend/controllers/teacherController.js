const TeacherCredentials = require('../models/TeacherCredentials');
const TeacherDetails = require('../models/TeacherDetails');

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

module.exports = { loginTeacher, getTeacherDetails };