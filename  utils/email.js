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
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; color: #333;">
    <h2 style="color: #0f172a;">Password Reset Request</h2>
    <p>We received a request to reset your TimePro account password.</p>
    <p>If you made this request, click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="display:inline-block; padding:12px 24px; background-color:#06b6d4; color:#ffffff; text-decoration:none; font-size:16px; border-radius:6px;">
        Reset Password
      </a>
    </div>

    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    
    <hr style="margin: 40px 0;" />
    <p style="font-size: 12px; color: #888;">© 2025 TimePro • All rights reserved.</p>
  </div>
`;


