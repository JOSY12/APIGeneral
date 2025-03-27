import { Router } from 'express'
import rutascompras from './rutascompras.js'
const fastcheckout = Router()

fastcheckout.use('/compras', rutascompras)

export default fastcheckout
