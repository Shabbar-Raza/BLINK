const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: String
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topics: [String],
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  attempts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: String,
      isCorrect: Boolean
    }],
    completedAt: Date
  }]
});

QuizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
