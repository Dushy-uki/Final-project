import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // password check skipped for brevity

  const token = jwt.sign(
    { id: user._id, role: user.role },     // payload
    process.env.JWT_SECRET,               // secret key
    { expiresIn: '7d' }                   // optional: token expiry
  );

  res.status(200).json({
    token,
    role: user.role,
    user: { id: user._id, name: user.name }
  });
};
