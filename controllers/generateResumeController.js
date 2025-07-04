import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!process.env.OPENAI_API_KEY) {
  console.error("\u274C OPENAI_API_KEY not found in .env!");
  process.exit(1);
}

const withTimeout = (promise, ms = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("OpenAI timeout")), ms)
    ),
  ]);
};

export const generateResumePDF = async (req, res) => {
  const { name, email, skills, experience, education } = req.body;

  if (!name || !skills || !experience || !education) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const skillsList = Array.isArray(skills) ? skills.join(", ") : skills;

  const prompt = `Return a detailed JSON resume with the following structure:
{
  "name": "Full Name",
  "role": "Job Title",
  "location": "City",
  "email": "Email",
  "phone": "Phone Number",
  "website": "Portfolio",
  "github": "GitHub Username",
  "linkedin": "LinkedIn Username",
  "skills": {
    "Frontend": [...],
    "Backend": [...],
    "DevOps": [...],
    "Languages": [...]
  },
  "interests": [...],
  "summary": "Professional summary here...",
  "experience": [...],
  "education": [...]
}
Use the data:
Name: ${name}
Email: ${email}
Skills: ${skillsList}
Experience: ${experience}
Education: ${education}
Return only valid JSON.`;

  try {
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
      15000
    );

    let content = completion.choices[0].message.content?.trim();
    content = content.replace(/^```json|```$/g, "").trim();
    const resume = JSON.parse(content);

    const filename = `resume_${resume.name.replace(/\s+/g, "_")}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.setHeader("Content-Type", "application/pdf");

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    const leftColX = 50;
    const rightColX = 250;
    const colGapY = 20;
    let y = 50;

    // Left Sidebar
    doc.fontSize(20).font("Helvetica-Bold").text(resume.name, leftColX, y);
    y += 25;
    doc.fontSize(12).font("Helvetica").text(resume.role || "", leftColX, y);
    y += 20;
    doc.text(resume.location || "", leftColX, y);
    y += 15;
    doc.text(resume.email || "", leftColX, y);
    y += 15;
    doc.text(resume.phone || "", leftColX, y);
    y += 15;
    doc.text(resume.website || "", leftColX, y);
    y += 15;
    doc.text(`GitHub: ${resume.github || ""}`, leftColX, y);
    y += 15;
    doc.text(`LinkedIn: ${resume.linkedin || ""}`, leftColX, y);

    y += 30;
    const renderSkillBlock = (title, items) => {
      doc.font("Helvetica-Bold").text(title, leftColX, y);
      y += 15;
      items.forEach((item) => {
        doc.font("Helvetica").text(`• ${item}`, leftColX + 10, y);
        y += 12;
      });
      y += 10;
    };

    Object.entries(resume.skills || {}).forEach(([category, items]) => {
      renderSkillBlock(category, items);
    });

    if (resume.languages) renderSkillBlock("Languages", resume.languages);
    if (resume.interests) renderSkillBlock("Interests", resume.interests);

    // Right Column
    let ry = 50;
    doc.fontSize(14).font("Helvetica-Bold").text("Summary", rightColX, ry);
    ry += 20;
    doc.fontSize(11).font("Helvetica").text(resume.summary || "", rightColX, ry, { width: 300 });
    ry += 80;

    doc.font("Helvetica-Bold").text("Experience", rightColX, ry);
    ry += 20;
    (resume.experience || []).forEach((exp) => {
      doc.font("Helvetica-Bold").text(`${exp.role} at ${exp.company}`, rightColX, ry);
      ry += 15;
      doc.font("Helvetica").text(`${exp.duration}`, rightColX, ry);
      ry += 12;
      (exp.details || []).forEach((d) => {
        doc.text(`- ${d}`, rightColX + 10, ry, { width: 300 });
        ry += 12;
      });
      ry += 10;
    });

    doc.font("Helvetica-Bold").text("Education", rightColX, ry);
    ry += 20;
    (resume.education || []).forEach((edu) => {
      doc.font("Helvetica-Bold").text(`${edu.degree}`, rightColX, ry);
      ry += 15;
      doc.font("Helvetica").text(`${edu.institution} (${edu.year})`, rightColX, ry);
      ry += 25;
    });

    doc.end();
  } catch (error) {
    console.error("Resume generation error:", error.message);
    return res.status(500).json({ error: "Failed to generate resume PDF" });
  }
};