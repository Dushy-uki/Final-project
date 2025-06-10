// controllers/generateResumeController.js
"use server";
import dotenv from "dotenv";
dotenv.config();
import PDFDocument from 'pdfkit';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateAndDownloadResume = async (req, res) => {
  const { name, email, skills, experience, education } = req.body;

  if (!name || !skills || !experience || !education) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `Create a professional resume for:
  Name: ${name}
  Email: ${email}
  Skills: ${skills.join(', ')}
  Experience: ${experience}
  Education: ${education}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const resumeText = completion.choices[0].message.content;

    const filename = `resume_${name.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(12).text(resumeText, { align: 'left' });
    doc.end();
  } catch (error) {
    console.error('Resume generation error:', error);

    if (error.status === 429 || error.code === 'insufficient_quota') {
      // fallback resume content
      const fallbackResume = `Resume for ${name}
Email: ${email}
Skills: ${skills.join(', ')}
Experience: ${experience}
Education: ${education}`;

      const filename = `resume_${name.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/pdf');

      const doc = new PDFDocument();
      doc.pipe(res);
      doc.fontSize(12).text(fallbackResume, { align: 'left' });
      doc.end();
    } else {
      res.status(500).json({ error: 'Failed to generate resume' });
    }
  }
};


const generateResumePDF = (req, res) => {
  const { name, email, skills, experience, education } = req.body;

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");

  doc.pipe(res);

  doc.fontSize(20).text(`Resume for ${name}`, { underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Email: ${email}`);
  doc.moveDown();
  doc.text(`Skills: ${skills}`);
  doc.moveDown();
  doc.text(`Experience: ${experience}`);
  doc.moveDown();
  doc.text(`Education: ${education}`);

  doc.end();
};

export default generateResumePDF;