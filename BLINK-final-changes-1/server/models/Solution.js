const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  problemImage: {
    type: String,
    required: true
  },
  problemText: {
    type: String,
    required: true
  },
  solutionSteps: [{
    stepNumber: Number,
    explanation: String,
    equation: String
  }],
  subject: {
    type: String,
    enum: ['math', 'physics', 'chemistry'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solution', SolutionSchema);
