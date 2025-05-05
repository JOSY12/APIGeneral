import { Router } from 'express'

import {
  agregar_producto,
  categorias,
  crear_categoria,
  editar_producto,
  eliminar_producto,
  listar_producto,
  listar_productos
} from '../Controllers/Productos_control.js'
const rutasproductos = Router()
// productos
rutasproductos.post('/crear_producto', agregar_producto)
rutasproductos.get('/productos', listar_productos)
rutasproductos
  .route('/producto/:id')
  .get(listar_producto)
  .delete(eliminar_producto)
  .put(editar_producto)
// categorias de productos
rutasproductos.post('/crear_categoria', crear_categoria)
rutasproductos.get('/categorias', categorias)
rutasproductos.delete('/categorias/:id', agregar_producto)

export default rutasproductos
