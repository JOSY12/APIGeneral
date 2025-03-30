import { Router } from 'express'

import {
  Actualizar_usuarios,
  borrar_usuarios,
  crear_usuarios,
  perfil_usuarios,
  todos_usuarios
} from '../Controllers/Usuarios_control.js'

const rutasusuarios = Router()
//inserta el usuarios nuevo junto a su carrito y favoritos
rutasusuarios.post('/crear', crear_usuarios)
//obtiene todos los usuarios sin contrasena
rutasusuarios.get('/usuarios', todos_usuarios)

rutasusuarios
  .route(':id')
  .get(perfil_usuarios)
  .put(Actualizar_usuarios)
  .delete(borrar_usuarios)

export default rutasusuarios
