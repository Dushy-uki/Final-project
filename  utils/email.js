// utils/email.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"TimePro" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

export const sendConfirmationEmail = async (to, name) => {
  await sendEmail({
    to,
    subject: 'Resume Payment Successful ✔',
    html: `
      <h3>Hi ${name},</h3>
      <p>Your payment for resume generation was successful.</p>
      <p>You can now download your resume from your dashboard or directly from the success screen.</p>
      <br/>
      <p>Thank you for using <strong>TimePro</strong>!</p>
    `
  });
};
