import express from 'express';
import { register, login } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/mailController.js';
import { logoutUser } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logoutUser);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // You can also store token in cookie here
    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  }
);


export default router;
