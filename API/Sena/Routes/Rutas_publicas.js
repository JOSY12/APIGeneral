import { Router } from 'express'
import {
  categorias,
  comentarios_producto,
  detalle_producto,
  landing_page_productos,
  listar_productos
} from '../Controllers/Productos_control.js'

const rutaspublicas = Router()

rutaspublicas.get('/productos', listar_productos)
rutaspublicas.get('/inicio_landing_page', landing_page_productos)

rutaspublicas.get('/productos/:id', detalle_producto)
rutaspublicas.get('/categorias', categorias)
rutaspublicas.get('/comentarios/:id', comentarios_producto)

export default rutaspublicas
