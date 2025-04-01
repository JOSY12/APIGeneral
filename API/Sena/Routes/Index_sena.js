import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'

const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', rutasusuarios)
senaindex.use('/p', rutasusuarios)

export default senaindex
