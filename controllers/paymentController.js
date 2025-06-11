import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // keep in .env

export const createCheckoutSession = async (req, res) => {
  const { amount, purpose } = req.body; // Example: amount: 500, purpose: "Resume Download"

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: purpose,
          },
          unit_amount: amount, // in cents ($5 = 500)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
  console.error("Stripe error:", error); // log full error
  res.status(500).json({ error: error.message });
}
}
