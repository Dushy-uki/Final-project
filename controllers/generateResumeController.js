import axios from 'axios';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const generateResume = async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education } = req.body;

    if (!name || !skills || !experience || !education) {
      return res.status(400).json({ error: 'Missing required resume fields' });
    }

    const prompt = `
You are a professional resume writer. Based on the details below, generate a polished resume in plain text format:

Name: ${name}
Email: ${email}
Phone: ${phone}
Skills: ${skills.join(', ')}
Experience: ${experience}
Education: ${education}

Write it in a clean, professional tone.
`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are an AI that generates professional resumes.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const resumeText = response.data.choices[0].message.content;


    // ✅ Ensure the 'resumes' directory exists
const resumeDir = path.join('resumes');
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir);
}

    // ✅ Generate PDF
    const doc = new PDFDocument();
    const filePath = path.join('resumes', `${name.replace(/\s+/g, '_')}_resume.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.fontSize(12).text(resumeText, { align: 'left' });
    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath, `${name}_resume.pdf`, err => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up file after sending
        fs.unlink(filePath, () => {});
      });
    });

  } catch (error) {
    console.error('Resume generation failed:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || error.message
    });
  }
};
