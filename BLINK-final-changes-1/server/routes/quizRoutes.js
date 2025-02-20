const express = require('express');
const Quiz = require('../models/Quiz.js');


const router = express.Router();

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all quizzes for a user
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;
    
    const attempt = {
      user: req.user._id,
      answers: answers.map(answer => {
        const question = quiz.questions.id(answer.questionId);
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) score++;
        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect
        };
      }),
      score,
      completedAt: new Date()
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    res.json({ score, total: quiz.questions.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a quiz
router.put('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
