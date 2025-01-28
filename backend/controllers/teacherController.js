const TeacherCredentials = require('../models/TeacherCredentials');

// Signup for teachers
const signupTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newTeacher = new TeacherCredentials({ name, email, password });
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher signed up successfully', teacher: newTeacher });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

module.exports = { signupTeacher, loginTeacher };