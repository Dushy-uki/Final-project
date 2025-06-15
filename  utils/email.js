import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Not Loaded');

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
    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error('Failed to send email');
  }
};
