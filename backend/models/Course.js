const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'reading', 'quiz', 'assignment'], required: true },
  duration: { type: String, required: true },
  url: { type: String },
  completed: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  completed: { type: Boolean, default: false },
  lectures: [lectureSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'teacherdetail', required: true },
  thumbnail: { type: String },
  totalHours: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'studentdetail' }],
  modules: [moduleSchema],
  createdAt: { type: Date, default: Date.now }
});

// Calculate derived fields
courseSchema.virtual('totalModules').get(function() {
  return this.modules.length;
});

courseSchema.virtual('completedModules').get(function() {
  return this.modules.filter(module => module.completed).length;
});

// Calculate progress percentage
courseSchema.virtual('progress').get(function() {
  if (this.modules.length === 0) return 0;
  return Math.round((this.completedModules / this.totalModules) * 100);
});

// Make sure virtuals are included when converted to JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);