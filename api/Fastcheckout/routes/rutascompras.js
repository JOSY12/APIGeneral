import { Router } from 'express'
import { crearcompra } from '../controllers/controllerscompras.js'
const rutascompras = Router()

rutascompras.post('/crear', crearcompra)

export default rutascompras
