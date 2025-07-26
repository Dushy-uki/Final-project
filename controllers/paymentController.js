// controllers/paymentController.js
import Stripe from "stripe";
import { sendConfirmationEmail } from '../ utils/email.js';
import Payment from '../models/Payment.js'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session
export const createCheckoutSession = async (req, res) => {
  const { amount, purpose, successUrl,paymentStatus } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: purpose },
          unit_amount: amount, // amount in cents (e.g., 200 = $2)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/generate-resume?paid=true`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
       metadata: {
    userId: req.body.userId,  // send userId from frontend
    purpose,
  }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/payment/record
export const savePayment = async (req, res) => {
    console.log('savePayment called with body:', req.body);  // <--- Add this

  const { userId, name, email, amount, purpose } = req.body;

  try {
    const payment = new Payment({
      user: userId,
      name,
      email,
      amount,
      purpose,
      paymentStatus: 'pending',
      date: new Date(),
    });

    await payment.save();

    if (email) {
      await sendConfirmationEmail(email, name);
    }

    res.status(200).json({ message: 'Payment saved and email sent' });
  } catch (err) {
    console.error("Email or DB error:", err);
    res.status(500).json({ error: 'Failed to save payment or send email' });
  }
};

// GET /api/payment/all
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};
