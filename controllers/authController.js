// controllers/authController.js
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSuccessTemplate } from '../models/resetTemplate.js';
import { sendEmail } from '../ utils/email.js';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      type: user.role === 'admin' ? 'adminToken' : user.role === 'provider' ? 'providerToken' : 'userToken'
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const sendLoginEmail = async (user) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Login Successful - TimePro',
      html: loginSuccessTemplate(user.name),
    });
  } catch (emailErr) {
    console.error('Login email send error:', emailErr);
  }
};

const allowedRoles = ['admin', 'user', 'provider'];

// ========================== REGISTER ===========================

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: `${role} registration successful` });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// =========================== LOGIN ============================

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

    const token = generateToken(user);

    res.status(200).json({
      message: `${user.role} login successful`,
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        avatar: user.avatar,
      },
    });

    await sendLoginEmail(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ======================= RESET PASSWORD ========================

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

export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// =========================== GOOGLE LOGIN ============================

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        password: '',
        role: 'user',
      });
    }

    const jwtToken = generateToken(user);

    res.status(200).json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Google login failed' });
  }
};
