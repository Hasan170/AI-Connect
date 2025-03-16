const mongoose = require("mongoose");

const teacherDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: Number, required: true },
  qualification: { type: String, required: true }
});

module.exports = mongoose.model("teacherdetail", teacherDetailsSchema);
