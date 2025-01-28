const StudentCredentials = require('../models/StudentCredentials');

// Signup for students
const signupStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newStudent = new StudentCredentials({ name, email, password });
    await newStudent.save();
    res.status(201).json({ message: 'Student signed up successfully', student: newStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

module.exports = { signupStudent, loginStudent };