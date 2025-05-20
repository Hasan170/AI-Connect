const mongoose = require('mongoose');

const subjectRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'studentdetail', required: true },
  subject: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubjectRequest', subjectRequestSchema);