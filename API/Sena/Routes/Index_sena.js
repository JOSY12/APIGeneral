import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'
import rutasproductos from './Rutas_productos.js'
import clerkwebhook from './ClerkWebhook.js'
import { clerkMiddleware } from '@clerk/express'
const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', clerkMiddleware(), rutasusuarios)
senaindex.use('/clerk', clerkwebhook)

senaindex.use('/p', rutasproductos)
export default senaindex
