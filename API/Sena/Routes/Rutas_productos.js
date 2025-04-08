import { Router } from 'express'

import {
  agregar_producto,
  editar_producto,
  eliminar_producto,
  listar_producto,
  listar_productos
} from '../Controllers/Productos_control.js'
const rutasproductos = Router()
rutasproductos.post('/crear', agregar_producto)
rutasproductos.get('/productos', listar_productos)
rutasproductos
  .route('/producto/:id')
  .get(listar_producto)
  .delete(eliminar_producto)
  .put(editar_producto)

export default rutasproductos
