const mongoose = require('mongoose');

const studentRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true }, // ✅ Always save as lowercase
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentRequest', studentRequestSchema);