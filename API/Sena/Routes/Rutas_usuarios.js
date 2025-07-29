import { Router } from 'express'

import {
  Actualizar_usuarios,
  agregar_carrito,
  agregar_direccion,
  agregar_favorito,
  borrar_notificacion,
  borrar_todas_notificaciones,
  borrar_usuarios,
  carrito,
  contador_notificaciones,
  detalle_compra,
  editar_direccion_predeterminada,
  eliminar_direccion,
  favoritos,
  historial_compras,
  marcar_visto,
  modificar_cantidad,
  notificaciones,
  obtener_direcciones,
  perfil_usuarios,
  quitar_carrito,
  quitar_favorito,
  todos_usuarios
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
rutasusuarios.post('/agregar_favorito', agregar_favorito)

rutasusuarios.delete('/quitar_favorito/:id', quitar_favorito)
// CARRITO
rutasusuarios.get('/carrito', carrito)
rutasusuarios.put('/carrito_cantidad', modificar_cantidad)

rutasusuarios.post('/agregar_carrito', agregar_carrito)
rutasusuarios.delete('/quitar_carrito/:id', quitar_carrito)

// HISTORIAL COMPRAS
rutasusuarios.get('/mis_compras', historial_compras)
rutasusuarios.get('/detalle_compra/:id', detalle_compra)

// DIRECCIONES
rutasusuarios.get('/direcciones', obtener_direcciones)
rutasusuarios.put('/predeterminar_direccion', editar_direccion_predeterminada)
rutasusuarios.post('/agregar_direccion', agregar_direccion)
rutasusuarios.delete('/eliminar_direccion/:id', eliminar_direccion)
export default rutasusuarios
