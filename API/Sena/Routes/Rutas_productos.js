import { Router } from 'express'

import {
  agregar_producto,
  borrar_categoria,
  categorias,
  crear_categoria,
  editar_producto,
  eliminar_producto,
  detalle_producto,
  listar_productos,
  crear_comentario,
  detalle_producto_editar
} from '../Controllers/Productos_control.js'
const rutasproductos = Router()
// productos
rutasproductos.post('/crear_producto', agregar_producto)
rutasproductos.get('/detalle_producto_editar/:id', detalle_producto_editar)
rutasproductos
  .route('/productos/:id')
  .delete(eliminar_producto)
  .put(editar_producto)
// categorias de productos
rutasproductos.post('/crear_categoria', crear_categoria)
rutasproductos.delete('/categorias/:id', borrar_categoria)
// comentarios de productos
rutasproductos.post('/crear_comentario', crear_comentario)

export default rutasproductos
