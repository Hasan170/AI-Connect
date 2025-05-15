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
      return this.feedbackType === 'studentToTutor';
    },
    validate: {
      validator: function(value) {
        // If this is studentToTutor feedback, value must be between 1-5
        if (this.feedbackType === 'studentToTutor') {
          return value >= 1 && value <= 5;
        }
        // For tutorToStudent, allow null or any value
        return true;
      },
      message: 'Rating must be between 1 and 5 for student feedback'
    },
    default: function() {
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