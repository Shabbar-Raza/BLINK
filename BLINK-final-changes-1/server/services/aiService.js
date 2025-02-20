const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function processProblem(problemText, subject) {
  try {
    const prompt = `You are an expert ${subject} tutor. Explain the solution to this problem step by step:\n\n${problemText}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful ${subject} tutor. Explain concepts clearly and provide step-by-step solutions.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response into structured steps
    const solutionText = response.choices[0].message.content;
    const steps = solutionText.split('\n').filter(step => step.trim() !== '');
    
    return steps.map((step, index) => ({
      stepNumber: index + 1,
      explanation: step
    }));
  } catch (error) {
    console.error('Error processing problem:', error);
    throw error;
  }
}

module.exports = { processProblem };
