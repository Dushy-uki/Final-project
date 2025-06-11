// controllers/generateResumeController.js
import { Document, Packer, Paragraph, TextRun } from "docx";
import { writeFileSync } from "fs";
import PDFDocument from "pdfkit";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateAndDownloadResume = async (req, res) => {
  const { name, email, phone, address, summary, skills, experience, education, projects, format } = req.body;

  if (!name || !skills || !experience || !education) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `Generate a professional resume for the following details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
Summary: ${summary}
Skills: ${skills.join(', ')}
Experience: ${experience.map(e => `${e.title} at ${e.company} (${e.duration}) - ${e.description}`).join('; ')}
Education: ${education.map(ed => `${ed.degree} at ${ed.institution} (${ed.year})`).join('; ')}
Projects: ${projects.map(p => `${p.title} - ${p.description}`).join('; ')}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const resumeText = completion.choices[0].message.content;

    const filenameBase = `resume_${name.trim().replace(/\s+/g, '_')}`;

    if (format === "pdf") {
      const filename = `${filenameBase}.pdf`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/pdf");

      const doc = new PDFDocument();
      doc.pipe(res);
      doc.fontSize(12).text(resumeText, { align: "left" });
      doc.end();
    } else if (format === "docx") {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph({ children: [new TextRun(resumeText)] })],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const filename = `${filenameBase}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.send(buffer);
    } else {
      return res.status(400).json({ error: "Invalid format specified" });
    }
  } catch (error) {
    console.error("Resume generation failed:", error);
    res.status(500).json({ error: "Resume generation failed" });
  }
};
