import { Router } from 'express'
import {
  // comprarmercadopago,
  comprarstripe,
  verificarpagos
} from '../controllers/controllerscompras.js'
const rutascompras = Router()

// rutascompras.post('/mercadopago', comprarmercadopago)
rutascompras.post('/stripe', comprarstripe)
rutascompras.post('/pagos', verificarpagos)

export default rutascompras
