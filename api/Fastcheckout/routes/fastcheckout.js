import { Router } from 'express'
import rutascompras from './rutascompras.js'
const fastcheckout = Router()

fastcheckout.use('/compras', rutascompras)
fastcheckout.get('/', (req, res) => {
  res.send('fastcheckout vivo')
})
export default fastcheckout
