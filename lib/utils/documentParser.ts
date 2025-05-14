import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';
import * as mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export async function extractTextFromDocument(file: Buffer, fileType: string): Promise<string> {
  try {
    console.log('Starting text extraction for file type:', fileType);
    console.log('File buffer size:', file.length);
    let text = '';
    
    // Create a temporary file in the OS temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${Math.random().toString(36).substring(7)}`);
    console.log('Created temp file at:', tempFilePath);
    
    // Convert Buffer to Uint8Array for fs.writeFile
    const uint8Array = new Uint8Array(file);
    await fs.writeFile(tempFilePath, uint8Array);
    console.log('Wrote file to temp location, size:', file.length);

    try {
      const normalizedFileType = fileType.toLowerCase();
      console.log('Normalized file type:', normalizedFileType);

      if (normalizedFileType.includes('pdf') || normalizedFileType === 'application/pdf') {
        console.log('Processing PDF file...');
        try {
          const pdfData = await pdfParse(file, {
            max: 0, // No page limit
            version: 'v2.0.550'
          });
          text = pdfData.text;
          console.log('PDF metadata:', {
            pages: pdfData.numpages,
            info: pdfData.info,
            version: pdfData.version
          });
          console.log('PDF text extracted, length:', text.length);
        } catch (error: any) {
          console.error('Error parsing PDF:', error);
          throw new Error(`Failed to parse PDF: ${error?.message || 'Unknown error'}`);
        }
      } else if (normalizedFileType.includes('docx') || normalizedFileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing DOCX file...');
        try {
          const result = await mammoth.extractRawText({ buffer: file });
          text = result.value;
          console.log('DOCX text extracted, length:', text.length);
        } catch (error: any) {
          console.error('Error parsing DOCX:', error);
          throw new Error(`Failed to parse DOCX: ${error?.message || 'Unknown error'}`);
        }
      } else if (normalizedFileType.includes('text') || normalizedFileType === 'text/plain' || normalizedFileType === 'txt') {
        console.log('Processing TXT file...');
        text = file.toString('utf-8');
        console.log('TXT text extracted, length:', text.length);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      if (text.length === 0) {
        console.warn('Warning: Extracted text is empty');
        throw new Error('No text could be extracted from the document');
      }

      console.log('Text extraction successful');
      console.log('Sample of extracted text:', text.substring(0, 100));

      return text;
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFilePath);
        console.log('Temp file cleaned up successfully');
      } catch (error: any) {
        console.error('Error cleaning up temp file:', error?.message);
      }
    }
  } catch (error: any) {
    console.error('Error in extractTextFromDocument:', error?.message);
    throw error;
  }
} 