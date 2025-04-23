import { Router } from 'express'

import {
  Actualizar_usuarios,
  borrar_usuarios,
  notificaciones,
  perfil_usuarios,
  todos_usuarios
  // tost
} from '../Controllers/Usuarios_control.js'

const rutasusuarios = Router()
//inserta el usuarios nuevo junto a su carrito y favoritos
// rutasusuarios.post('/crear', crear_usuarios)
//obtiene todos los usuarios sin contrasena
rutasusuarios.get('/usuarios', todos_usuarios)
// rutasusuarios.get('/tost', tost)

rutasusuarios
  .route('/perfil')
  .get(perfil_usuarios)
  .put(Actualizar_usuarios)
  .delete(borrar_usuarios)

rutasusuarios.route('/notificaciones').get(notificaciones)

export default rutasusuarios
