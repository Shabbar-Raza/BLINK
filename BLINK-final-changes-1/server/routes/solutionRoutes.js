const express = require('express');
const Solution = require('../models/Solution');
const { processProblem } = require('../services/aiService');
const { extractTextFromImage } = require('../utils/imageProcessor');
const router = express.Router();


// Submit problem
router.post('/submit', async (req, res) => {
  try {
    const { imageUrl, subject } = req.body;
    
    // Extract text from image
    const problemText = await extractTextFromImage(imageUrl);
    
    // Process problem using AI
    const solutionSteps = await processProblem(problemText, subject);

    
    // Save solution
    const solution = new Solution({
      problemImage: imageUrl,
      problemText,
      solutionSteps,
      subject
    });
    
    await solution.save();
    
    res.status(201).json({ solution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get solution by ID
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }
    res.json({ solution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
