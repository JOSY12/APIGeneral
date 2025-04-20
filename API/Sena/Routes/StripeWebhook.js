import { Router } from 'express'
import PagosStripe from '../../Stripe.js'
const secreto = process.env.STRIPE_WEBHOOK_SECRET
const stripewebhook = Router()

stripewebhook.post('/webhook', async (req, res) => {
  let event = req.body

  if (secreto) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']

    try {
      event = PagosStripe.webhooks.constructEvent(req.body, signature, secreto)

      // Handle the event
      switch (event.type) {
        case 'payment_intent.created':
          const paymentIntentCreated = event.data.object
          console.log('PaymentIntent created:', paymentIntentCreated)
          break
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object
          console.log('PaymentIntent was successful!', paymentIntent)
          break

        case 'payment_intent.payment_failed':
          const paymentFailed = event.data.object
          console.log('PaymentIntent failed:', paymentFailed)
          break
        case 'payment_intent.processing':
          const paymentProcessing = event.data.object
          console.log('PaymentIntent is processing:', paymentProcessing)
          break

        case 'payment_intent.canceled':
          const paymentCanceled = event.data.object
          console.log('PaymentIntent was canceled:', paymentCanceled)
          break

        default:
          console.log(`Unhandled event type ${event.type}`)
      }
    } catch (err) {
      console.log(`⚠️  fallo al recibir o procesar webhook.`, err.message)
      return res.status(400)
    }
  } else {
    console.log(
      '⚠️  fallo al recibir o procesar webhook. Secreto no configurado'
    )
    return res.status(400).json({ error: 'token Secreto no configurado' })
  }

  return res.json({ recibido: true })
})

export default stripewebhook
