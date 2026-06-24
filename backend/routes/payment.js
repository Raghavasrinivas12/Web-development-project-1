require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ msg: "Amount must be at least 50 cents" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency || 'inr',
      metadata: { userId: req.user.userid },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Payment Intent Error:", err);
    return res.status(500).json({ msg: "Failed to create payment intent" });
  }
});

module.exports = router;
