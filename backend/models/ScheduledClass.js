const mongoose = require('mongoose');

const scheduledClassSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'studentdetail', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail', required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'rescheduled'], default: 'scheduled' },
  meetingLink: { type: String, required: true }, 
  meetingId: { type: String, required: true, unique: true },
  fees: { type: String, enum: ['Paid', 'Not paid'], default: null }
});

// Add compound index to prevent duplicate scheduling
scheduledClassSchema.index(
  { studentId: 1, teacherId: 1, date: 1, time: 1 },
  { unique: true, name: 'prevent_duplicate_classes' }
);

module.exports = mongoose.model('scheduledclass', scheduledClassSchema);