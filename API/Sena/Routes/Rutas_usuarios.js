import { Router } from 'express'

import {
  Actualizar_usuarios,
  borrar_usuarios,
  // Cerrar_sesion,
  crear_usuarios,
  // inciarsesion_usuarios,
  perfil_usuarios,
  todos_usuarios,
  tost
} from '../Controllers/Usuarios_control.js'

const rutasusuarios = Router()
//inserta el usuarios nuevo junto a su carrito y favoritos
rutasusuarios.post('/crear', crear_usuarios)
//obtiene todos los usuarios sin contrasena
rutasusuarios.get('/usuarios', todos_usuarios)
rutasusuarios.get('/tost', tost)

rutasusuarios
  .route('/perfil/:id')
  .get(perfil_usuarios)
  .put(Actualizar_usuarios)
  .delete(borrar_usuarios)

// rutasusuarios.post('/login', inciarsesion_usuarios)
// rutasusuarios.post('/logout', Cerrar_sesion)

export default rutasusuarios
