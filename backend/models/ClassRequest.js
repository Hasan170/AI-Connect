// backend/models/ClassRequest.js
const mongoose = require('mongoose');

const classRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'studentdetail', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail', required: true },
  subject: { type: String, required: true },
  requestedDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClassRequest', classRequestSchema);