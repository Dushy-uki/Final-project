import Resume from '../models/Resume.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateResumeWithGroq = async (req, res) => {
  const { user, name, email, phone, skills, experience, education } = req.body;

  const prompt = `
Generate a JSON resume following the https://jsonresume.org schema using this data:

Name: ${name}
Email: ${email}
Phone: ${phone}

Skills: ${skills.join(', ')}

Experience: ${experience}
Education: ${education}

Make sure the JSON contains at least:
- basics (name, email, phone)
- work: an array with at least one item with company, position, startDate, endDate, summary
- education: an array with at least one item with institution, area, studyType, startDate, endDate
- skills: an array with name and at least 2 keywords

Respond with **strict JSON only** — no extra explanation or markdown.
`;

  try {
    // 🧠 Call Together.ai
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const raw = response.data.choices[0].message.content;
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error("Together.ai response doesn't contain valid JSON.");
    }

    const jsonString = raw.slice(start, end + 1);
    const jsonResume = JSON.parse(jsonString);

    if (
      !jsonResume.basics ||
      !jsonResume.work || !Array.isArray(jsonResume.work) || jsonResume.work.length === 0 ||
      !jsonResume.education || !Array.isArray(jsonResume.education) || jsonResume.education.length === 0 ||
      !jsonResume.skills || !Array.isArray(jsonResume.skills) || jsonResume.skills.length === 0
    ) {
      console.error("Together raw output:", raw);
      throw new Error("Incomplete JSON Resume fields in Together.ai response.");
    }

    // 🗂️ Save to DB
    const resume = new Resume({
      user,
      basics: jsonResume.basics,
      skills: jsonResume.skills,
      education: jsonResume.education,
      experience: jsonResume.work,
      generatedAt: new Date()
    });
    await resume.save();

    // 💾 Write resume to temp files
    const tempDir = path.join(__dirname, '../temp');
    await fs.mkdir(tempDir, { recursive: true });

    const fileName = `${name.replace(/\s+/g, '_')}_resume.json`;
    const filePath = path.join(tempDir, fileName);
    const pdfPath = filePath.replace('.json', '.pdf');

    await fs.writeFile(filePath, JSON.stringify(jsonResume, null, 2));

    // 🖨️ Convert to PDF
    await new Promise((resolve, reject) => {
      exec(`resume export "${pdfPath}" --resume "${filePath}" --theme elegant`, (err, stdout, stderr) => {
        if (err) {
          console.error('Export error:', stderr);
          return reject(stderr);
        }
        resolve(stdout);
      });
    });

    // 📥 Send file to client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}_resume.pdf"`);

    res.download(pdfPath, `${name}_resume.pdf`, async (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // 🧼 Clean up files
      try {
        await fs.unlink(filePath);
        await fs.unlink(pdfPath);
      } catch (cleanupErr) {
        console.warn('Cleanup failed:', cleanupErr.message);
      }
    });

  } catch (error) {
    console.error('Together/Export error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to generate styled resume' });
  }
};
