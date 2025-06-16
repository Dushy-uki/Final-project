import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendEmail } from '../ utils/email.js';
import { resetPasswordTemplate } from '../models/resetTemplate.js';
export const forgotPassword = async (req, res) => {
  console.log('Forgot password called, body:', req.body);
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset - TimePro',
        html: resetPasswordTemplate(resetLink),
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

