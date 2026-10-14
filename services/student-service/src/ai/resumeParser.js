const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract plain text from a PDF Buffer.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
const parsePdfBuffer = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid PDF buffer provided.');
  }

  try {
    const data = await pdfParse(buffer);
    return (data.text || '').replace(/\r\n/g, '\n').trim();
  } catch (err) {
    throw new Error(`Failed to parse PDF buffer: ${err.message}`);
  }
};

/**
 * Extract plain text from a PDF file located on disk.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
const parsePdfFile = async (filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path provided.');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found at path: ${filePath}`);
  }

  const buffer = fs.readFileSync(filePath);
  return parsePdfBuffer(buffer);
};

module.exports = {
  parsePdfBuffer,
  parsePdfFile,
};
