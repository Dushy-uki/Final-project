import Payment from '../models/Payment.js'; // assuming your payment model import
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Stripe webhook verified:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const amountTotal = session.amount_total;
    const purpose = session.metadata.purpose;

    if (!userId) {
      return res.status(400).send('Missing userId in metadata');
    }

    // Update payment document
    try {
      await Payment.findOneAndUpdate(
        {
          user: userId,
          amount: amountTotal,
          purpose,
          paymentStatus: 'pending'
        },
        { paymentStatus: 'succeeded' }
      );
      console.log("Webhook Event Type:", event.type);
console.log("UserId:", userId);
console.log("Amount Total:", amountTotal);
console.log("Purpose:", purpose);
      console.log(`Payment status updated for user ${userId}`);
    } catch (err) {
      console.error('DB update failed:', err);
      return res.status(500).send('Database update error');
    }
  }

  res.json({ received: true });
};
