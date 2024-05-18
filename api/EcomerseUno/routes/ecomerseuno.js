import { Router } from 'express'
import rutasusuarios from './rutasusuarios.js'
const ecomerseuno = Router()

// ecomerseUno.use('/compras', rutascompras)
ecomerseuno.use('/usuarios', rutasusuarios)

export default ecomerseuno
