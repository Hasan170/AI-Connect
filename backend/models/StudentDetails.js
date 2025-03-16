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

module.exports = mongoose.model('studentdetail', studentDetailsSchema);