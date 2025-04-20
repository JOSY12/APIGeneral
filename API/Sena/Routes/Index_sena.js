import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'
import rutasproductos from './Rutas_productos.js'
import clerkwebhook from './ClerkWebhook.js'
import { requireAuth } from '@clerk/express'
import { privada } from '../Controllers/Usuarios_control.js'
import rutasstripe from './Rutas_stripe.js'
const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', rutasusuarios)
senaindex.use('/clerk', clerkwebhook)
senaindex.use('/privada', requireAuth(), privada)
senaindex.use('/p', rutasproductos)
senaindex.use('/stripe', rutasstripe)
export default senaindex
