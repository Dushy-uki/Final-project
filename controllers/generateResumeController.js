import Resume from '../models/Resume.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateResumeWithGroq = async (req, res) => {
  const { userId, name, email, phone, skills, experience, education } = req.body;

  const prompt = `
Generate a resume in JSON Resume format (https://jsonresume.org). Use this info:
Name: ${name}
Email: ${email}
Phone: ${phone}
Skills: ${skills.join(', ')}
Experience: ${experience}
Education: ${education}
Return only valid JSON, no markdown or extra text.
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const jsonResume = JSON.parse(response.data.choices[0].message.content);

    // Save to MongoDB (optional)
    const resume = new Resume({
      user: userId,
      basics: jsonResume.basics,
      skills: jsonResume.skills,
      education: jsonResume.education,
      work: jsonResume.work,
      generatedAt: new Date()
    });
    await resume.save();

    // Write JSON to file
    const fileName = `${name.replace(/\s+/g, '_')}_resume.json`;
    const filePath = path.join(__dirname, `../temp/${fileName}`);
    const pdfPath = filePath.replace('.json', '.pdf');
    await fs.writeFile(filePath, JSON.stringify(jsonResume, null, 2));

    // Export PDF with a theme using resume-cli@1.0.0
    await new Promise((resolve, reject) => {
      exec(`resume export ${pdfPath} --resume ${filePath} --theme elegant`, (err, stdout, stderr) => {
        if (err) {
          console.error('Export error:', stderr);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });

    // Send the PDF as a download
    res.download(pdfPath, `${name}_resume.pdf`);

  } catch (error) {
    console.error('Groq/Export error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate styled resume' });
  }
};
