const Tesseract = require('tesseract.js');
const axios = require('axios');

async function extractTextFromImage(imageUrl) {
  try {
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    // Process image with Tesseract
    const { data: { text } } = await Tesseract.recognize(
      Buffer.from(response.data),
      'eng',
      {
        logger: m => console.log(m)
      }
    );
    
    return text;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

module.exports = { extractTextFromImage };
