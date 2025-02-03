const StudentRequest = require('../models/StudentRequest');
const TeacherRequest = require('../models/TeacherRequest');

// Handle student class requests
const createStudentRequest = async (req, res) => {
  try {
    const newRequest = new StudentRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Handle tutor applications
const createTeacherRequest = async (req, res) => {
  try {
    const newRequest = new TeacherRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
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