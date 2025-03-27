import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import Stripe from 'stripe'
const cliente = new MercadoPagoConfig({
  accessToken: process.env.TOKENMERCADOPAGO
})

const PagosStripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const PagosMercadopago = new Payment(cliente)

const Mercadopago = new Preference(cliente)

export { Mercadopago, PagosMercadopago, PagosStripe }
