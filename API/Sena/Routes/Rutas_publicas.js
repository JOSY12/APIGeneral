import { Router } from 'express'
import {
  categorias,
  comentarios_producto,
  detalle_producto,
  listar_productos
} from '../Controllers/Productos_control.js'

const rutaspublicas = Router()

rutaspublicas.get('/productos', listar_productos)
rutaspublicas.get('/productos/:id', detalle_producto)
rutaspublicas.get('/categorias', categorias)
rutaspublicas.get('/comentarios/:id', comentarios_producto)

export default rutaspublicas
