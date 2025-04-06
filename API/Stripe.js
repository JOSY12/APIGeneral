import Stripe from 'stripe'

const PagosStripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default PagosStripe
