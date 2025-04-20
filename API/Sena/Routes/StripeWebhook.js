import { Router } from 'express'
import PagosStripe from '../../Stripe'
const secreto = process.env.STRIPE_WEBHOOK_SECRET
const stripewebhook = Router()

stripewebhook.post('/webhook', async (req, res) => {
  let event = req.body

  if (secreto) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']

    try {
      event = PagosStripe.webhooks.constructEvent(req.body, signature, secreto)
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return res.status(400)
    }
  }

  return res.json({ received: true })
})

export default stripewebhook
