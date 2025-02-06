// const mongoose = require('mongoose');

// const teacherDetailsSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     expertise: { type: String, required: true }, // Stored as a comma-separated string
//     teachingHours: { type: Number, required: true },
//     totalEarnings: { type: Number, required: true },
//     rating: { type: Number, required: true },
// });

// module.exports = mongoose.model('teacherdetail', teacherDetailsSchema);

const mongoose = require("mongoose");

const teacherDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: Number, required: true },
  qualification: { type: String, required: true }
});

module.exports = mongoose.model("teacherdetail", teacherDetailsSchema);
