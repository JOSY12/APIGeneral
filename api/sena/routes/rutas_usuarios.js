import { Router } from 'express'

import {
  crear_usuario,
  todos_usuarios
} from '../controllers/usuarios_controllers.js'

const rutasusuarios = Router()

rutasusuarios.post('/crear', crear_usuario)
rutasusuarios.get('/usuarios', todos_usuarios)

export default rutasusuarios
