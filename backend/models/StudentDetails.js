const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  board: { type: String, required: true },
  subjects: [
    {
      subject: { type: String, required: true },
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail', required: true }
    }
  ]
});

// Ensure emails are consistently stored and queried in lowercase
studentDetailsSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Create a case-insensitive index on email field
studentDetailsSchema.index({ email: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } // Case-insensitive index
});

module.exports = mongoose.model('studentdetail', studentDetailsSchema);