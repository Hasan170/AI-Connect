// backend/models/ScheduledClass.js
const mongoose = require('mongoose');

const scheduledClassSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'studentdetail', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail', required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'rescheduled'], default: 'scheduled' },
  meetingLink: { type: String } // For WebRTC integration later
});

module.exports = mongoose.model('ScheduledClass', scheduledClassSchema);