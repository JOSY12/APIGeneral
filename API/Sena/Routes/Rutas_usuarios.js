import { Router } from 'express'

import {
  crear_usuario,
  todos_usuarios
} from '../Controllers/Usuarios_control.js'

const rutasusuarios = Router()
//inserta el usuarios nuevo junto a su carrito y favoritos
rutasusuarios.post('/crear', crear_usuario)
//obtiene todos los usuarios sin contrasena
rutasusuarios.get('/usuarios', todos_usuarios)
//eliminar un usuario en particular
// rutasusuarios.delete('/usuarios/:id', elimina_usuario)
//actualiza la informacion de un estudiante en particular
// rutasusuarios.update('/usuarios/:id', actualiza_usuarios)

export default rutasusuarios
