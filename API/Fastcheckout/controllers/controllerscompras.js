import PagosStripe from '../../MercadoPago_Stripe.js'
import { v4 as uuidv4 } from 'uuid'
const SECRETO = process.env.STRIPE_WEBHOOK_SECRET
// export const comprarmercadopago = async (req, res) => {
//   const { compras } = req.body
//   try {
//     if (compras.length === 0) {
//       return res.status(500).json({
//         mensaje: 'no hay compras'
//       })
//     }
//     const comprando = []
//     if (compras.length) {
//       for (let i = 0; i < compras.length; i++) {
//         const element = compras[i]
//         comprando.push({
//           id: i + 1,
//           title: element.nombre,
//           unit_price: element.precio * 10,
//           quantity: element.cantidad

//           // category_id: element.categoria,
//           // image_url: element.imagen
//         })
//       }
//     }

//     const body = {
//       items: comprando,

//       binary_mode: true,

//       back_urls: {
//         success: `${process.env.DEPLOY}/exito`,
//         failure: `${process.env.DEPLOY}/fallo`
//       },
//       payer: {
//         email: 'test_user_123@testuser.com'
//       },
//       installments: 1,
//       auto_return: 'approved'
//     }
//     const random = uuidv4()
//     await Mercadopago.create({
//       body,
//       idempotencyKey: random
//     }).then(result => {
//       console.log(result)
//       return res.status(200).json(result.init_point)
//       // return res.status(200).json({ result, random })
//     })
//   } catch (error) {
//     return res.status(500).json({
//       mensaje: `hubo un error ${error} no se pudo crear la compra`
//     })
//   }
// }
// aqui se crea la compra en stripe
export const comprarstripe = async (req, res) => {
  const { compras } = req.body

  try {
    if (compras.length === 0) {
      return res.status(500).json({
        mensaje: 'no hay compras'
      })
    }
    const comprando = []
    if (compras.length) {
      for (let i = 0; i < compras.length; i++) {
        const element = compras[i]
        comprando.push({
          price_data: {
            currency: 'USD',
            product_data: {
              name: element.nombre,
              description: element.categoria,
              images: [element.img]
            },
            unit_amount: element.precio * 100
          },

          quantity: element.cantidad
          // customer_email: 'test_user_123fastcheckout@testuser.com',
        })
      }
    }
    const origin = req.headers.origin

    const comprastripe = await PagosStripe.checkout.sessions.create({
      line_items: comprando,
      metadata: {
        idcomprador: 'miideaparacompras'
      },
      mode: 'payment',
      // shipping_address_collection: {
      //   allowed_countries: ['US']
      // },
      success_url: `${origin}/exito`,
      cancel_url: `${origin}/fallo`
      // customer_email: 'test_user_123@testuser.com'
    })
    res.status(200).json(comprastripe.url)
  } catch (error) {
    res.status(500).json({
      mensaje: `hubo un error ${error} no se pudo crear la compra`
    })
  }
}
//vertificar si se ha completado la compra en stripe
export const verificarpagos = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = PagosStripe.webhooks.constructEvent(req.rawBody, sig, SECRETO)
  } catch (err) {
    res.status(400).send(` Webhook Error: ${err.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSessionCompleted = event.data.object

    PagosStripe.checkout.sessions
      .retrieve(checkoutSessionCompleted.id)
      .then(session => {
        console.log(`Session detail:`, session)
      })
      .catch(err => {
        console.log(`Error retrieving session:`, err)
      })

    PagosStripe.checkout.sessions
      .listLineItems(checkoutSessionCompleted.id)
      .then(lineItems => {
        console.log(`listLineItems items:`, lineItems)
      })
      .catch(err => {
        console.log(`Error listing line items:`, err)
      })
  } else {
    console.log(`evento no implementado ${event.type}`)
  }

  res.status(200).send('OK')
}
