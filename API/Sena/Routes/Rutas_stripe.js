import { Router } from 'express'
import { comprar_producto } from '../Controllers/Stripe_control'

const rutasstripe = Router()

rutasstripe.post('comprar', comprar_producto)
// rutasstripe.post('/webhook', async (req, res) => {
//   const evento = req.body

//   const { id, email_addresses, first_name, last_name } = evento.data
//   // /////////////
//   console.log(evento.type)
//   console.log('ID:', id)
//   console.log('Email:', email_addresses[0].email_address)
//   console.log('Nombre:', first_name)
//   console.log('Apellido:', last_name)
//   // Aquí puedes manejar el evento según tus necesidades

//   try {
//     return res.status(200).json({ message: 'Evento procesado correctamente' })
//   } catch (error) {
//     return res.status(500).json({ error: 'error en webhook' })
//   }
// })

export default rutasstripe
