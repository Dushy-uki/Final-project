import express from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/mailController.js';
import passport from 'passport';
import { resetPassword } from '../controllers/authController.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// ✅ Add this route for Google One-Tap / Token-based login
router.post('/google-login', googleLogin);

// ✅ Existing routes for Passport-based OAuth (redirect-based flow)
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.post('/reset-password/:token', resetPassword);


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
