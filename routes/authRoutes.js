import express from 'express';
import { register, login, logoutUser, googleLogin } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/mailController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);

// ✅ Add this route for Google One-Tap / Token-based login
router.post('/google-login', googleLogin);

// ✅ Existing routes for Passport-based OAuth (redirect-based flow)
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
    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  }
);

export default router;
