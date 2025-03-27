import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'

const senaindex = Router()

senaindex.use('/u', rutasusuarios)

export default senaindex
