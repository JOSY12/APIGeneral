import { Router } from 'express'
import {
  registrarusuario,
  iniciarsesion,
  datosusuarios
} from '../controllers/usuarioscontraoller.js'
import { validar } from '../middlewares/zod.js'
import { esquemaregistro } from '../controllers/schemas/esquemaszod.js'
const rutasusuarios = Router()

rutasusuarios.post('/registrar', validar(esquemaregistro), registrarusuario)
// rutasusuarios.post('/registrar', registrarusuario)

rutasusuarios.post('/iniciar', iniciarsesion)
rutasusuarios.get('/:id', datosusuarios)

export default rutasusuarios
