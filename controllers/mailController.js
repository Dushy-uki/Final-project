import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendEmail, resetPasswordTemplate } from '../ utils/email.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Forgot password called, body:', req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: 'Password Reset - TimePro',
      html: resetPasswordTemplate(resetLink),
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ error: 'Failed to process password reset' });
  }
};
