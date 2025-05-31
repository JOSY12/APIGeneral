import { Router } from 'express'
import {
  // comprarmercadopago,
  comprarstripe
} from '../controllers/controllerscompras.js'
const rutascompras = Router()

// rutascompras.post('/mercadopago', comprarmercadopago)
rutascompras.post('/stripe', comprarstripe)

export default rutascompras
