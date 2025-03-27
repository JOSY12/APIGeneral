import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'

const sena_index = Router()

sena_index.use('/u', rutasusuarios)

export default sena_index
