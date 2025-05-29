import { Router } from 'express'
import rutasusuarios from './Rutas_usuarios.js'
import rutasproductos from './Rutas_productos.js'
import clerkwebhook from './ClerkWebhook.js'
import { requireAuth as RequiereAutorizacion } from '@clerk/express'
import rutasstripe from './Rutas_stripe.js'
import rutaspublicas from './Rutas_publicas.js'
const senaindex = Router()
// ruta que enlanza usuarios de sena
senaindex.use('/u', RequiereAutorizacion(), rutasusuarios)
senaindex.use('/clerk', clerkwebhook)
senaindex.use('/p', RequiereAutorizacion(), rutasproductos)
senaindex.use('/pu', rutaspublicas)
senaindex.use('/stripe_compras', RequiereAutorizacion(), rutasstripe)
export default senaindex
