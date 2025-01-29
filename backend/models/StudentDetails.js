const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  grade: { type: String, required: true },
  schoolBoard: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  subjects: { type: String, required: true },
});

module.exports = mongoose.model('studentdetail', studentDetailsSchema);