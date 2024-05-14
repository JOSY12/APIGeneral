import { Router } from 'express'
// import rutascompras from './rutascompras.js'
const ecomerseuno = Router()

// ecomerseUno.use('/compras', rutascompras)
ecomerseuno.get('/', (req, res) => {
  res.send('ecomerseuno vivo')
})
export default ecomerseuno
