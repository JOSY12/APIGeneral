import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'
import rutasproductos from './Rutas_productos.js'

const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', rutasusuarios)
senaindex.use('/p', rutasproductos)
export default senaindex
