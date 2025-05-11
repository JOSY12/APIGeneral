import { Router } from 'express'

import {
  Actualizar_usuarios,
  agregar_favorito,
  borrar_notificacion,
  borrar_todas_notificaciones,
  borrar_usuarios,
  contador_notificaciones,
  favoritos,
  marcar_visto,
  notificaciones,
  perfil_usuarios,
  quitar_favorito,
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
// NOTIFICACIONES
rutasusuarios.get('/notificaciones', notificaciones)
rutasusuarios.delete('/notificaciones/:id', borrar_notificacion)
rutasusuarios.delete(
  '/borrar_todas_notificaciones',
  borrar_todas_notificaciones
)

rutasusuarios.get('/contador_notificaciones', contador_notificaciones)
rutasusuarios.put('/marcar_visto', marcar_visto)
// FAVORITOS
rutasusuarios.get('/favoritos', favoritos)
rutasusuarios.put('/agregar_favorito/:id', agregar_favorito)

rutasusuarios.delete('/quitar_favorito/:id', quitar_favorito)
// CARRITO
// rutasusuarios.get('/carrito', carrito)
// rutasusuarios.put('/agregar_carrito/:id', agregar_carrito)
// rutasusuarios.delete('/quitar_carrito/:id', quitar_carrito)

export default rutasusuarios
