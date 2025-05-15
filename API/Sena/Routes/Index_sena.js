import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'
import rutasproductos from './Rutas_productos.js'
import clerkwebhook from './ClerkWebhook.js'
import { requireAuth } from '@clerk/express'
import rutasstripe from './Rutas_stripe.js'
import rutaspublicas from './Rutas_publicas.js'
const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', requireAuth(), rutasusuarios)
senaindex.use('/clerk', clerkwebhook)
senaindex.use('/p', rutasproductos)
senaindex.use('/pu', rutaspublicas)
senaindex.use('/stripe', rutasstripe)
export default senaindex
