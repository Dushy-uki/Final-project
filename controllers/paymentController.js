import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // keep in .env
import { sendConfirmationEmail } from '../ utils/email.js';


export const createCheckoutSession = async (req, res) => {
  const { amount, purpose, successUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: purpose,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/generate-resume?paid=true`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
};
// POST /api/payment/record
export const savePayment = async (req, res) => {
  const { userId, name, email, amount, purpose } = req.body;
  try {
    const payment = new Payment({
      user: userId,
      name,
      email,
      amount,
      purpose,
      date: new Date()
    });
    await payment.save();

    // send email
    await sendConfirmationEmail(email, name);

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

