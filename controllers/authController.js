// controllers/authController.js
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err.message); // ✅ Add this line for debugging
    res.status(500).json({ error: 'Server error' }); // ✅ Keep this response
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (err) {
    console.error('Login error:', err); // 👈 Helpful for debugging
    res.status(500).json({ error: 'Login failed' });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
