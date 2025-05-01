const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'studentdetail',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacherdetail',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: function() {
      // Rating is only required for student-to-tutor feedback
      return this.feedbackType === 'studentToTutor';
    },
    min: function() {
      // Min value is only enforced for student-to-tutor feedback
      return this.feedbackType === 'studentToTutor' ? 1 : 0;
    },
    max: 5,
    default: function() {
      // Default to null for tutor-to-student feedback
      return this.feedbackType === 'tutorToStudent' ? null : undefined;
    }
  },
  feedback: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'submitted'],
    default: 'submitted'
  },
  feedbackType: {
    type: String,
    enum: ['studentToTutor', 'tutorToStudent'],
    default: 'studentToTutor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;