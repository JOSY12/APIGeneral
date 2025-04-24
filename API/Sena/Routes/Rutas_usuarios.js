import { Router } from 'express'

import {
  Actualizar_usuarios,
  borrar_notificacion,
  borrar_todas_notificaciones,
  borrar_usuarios,
  contador_notificaciones,
  marcar_visto,
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

rutasusuarios.get('/notificaciones', notificaciones)
rutasusuarios.delete('/notificaciones/:id', borrar_notificacion)
rutasusuarios.delete(
  '/borrar_todas_notificaciones',
  borrar_todas_notificaciones
)

rutasusuarios.get('/contador_notificaciones', contador_notificaciones)
rutasusuarios.put('/marcar_visto', marcar_visto)

export default rutasusuarios
