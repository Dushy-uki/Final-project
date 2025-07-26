import express from 'express';
import {handleStripeWebhook} from '../controllers/webhookController.js';
const router = express.Router();


router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;



// # 1. Download the latest Linux release using wget
// wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.21.0_linux_x86_64.tar.gz -O stripe.tar.gz

// # 2. Extract the archive
// tar -xvzf stripe.tar.gz

// # 3. Move the binary to /usr/local/bin so it's globally accessible
// sudo mv stripe /usr/local/bin/

// # 4. Verify installation
// stripe --version


//#5 stripe login

//#6 stripe listen --forward-to localhost:5000/api/payment/webhook

// #7 stripe trigger checkout.session.completed ------ testing purpose