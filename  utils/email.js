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

export const resetPasswordTemplate = (link) => `
  <div style="font-family:sans-serif;">
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>If you did not request this, you can safely ignore this email.</p>
  </div>
`;

