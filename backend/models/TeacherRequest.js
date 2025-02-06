const mongoose = require('mongoose');

const teacherRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: Number, required: true },
  qualification: { type: String, required: true },
  bio: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('teacherrequest', teacherRequestSchema);