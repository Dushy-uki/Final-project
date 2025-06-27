import express from 'express';
import {
  createCheckoutSession,
  savePayment,
  getAllPayments
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/record', savePayment);
router.get('/all', getAllPayments);

export default router;
