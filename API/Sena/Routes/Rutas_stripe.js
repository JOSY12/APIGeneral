import { Router } from 'express'
import { comprar_producto } from '../Controllers/Stripe_control.js'

const rutasstripe = Router()

rutasstripe.post('/comprar', comprar_producto)

export default rutasstripe
