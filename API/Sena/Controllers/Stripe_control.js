import { clerkClient, getAuth } from '@clerk/express'
import PagosStripe from '../../Stripe.js'
import { DBPostgres } from '../../BDPostgres.js'

export const comprar_producto = async (req, res) => {
  const { userId } = getAuth(req)
  const { idproducto } = req.body
  try {
    const productos = []
    const producto = []
    const usuario = await clerkClient.users.getUser(userId)

    if (!idproducto) {
      const { rows } = await DBPostgres.query(
        'SELECT * FROM sena.comprar_stripe WHERE carrito_id = $1',
        [userId]
      )

      for (let e of rows) {
        productos.push({
          price_data: {
            product_data: {
              name: e.nombre,
              images: [e.foto],
              metadata: {
                product_id: e.id // Usar un campo diferente para el ID personalizado
              }
            },
            currency: 'usd',
            unit_amount: e.precio * 100
          },
          quantity: e.cantidad
        })
      }
    } else {
      const { rows } = await DBPostgres.query(
        'SELECT * FROM sena.comprar_stripe WHERE carrito_id = $1 AND id = $2',
        [userId, idproducto]
      )

      producto.push({
        price_data: {
          product_data: {
            name: rows[0].nombre,
            images: [rows[0].foto],
            metadata: {
              product_id: rows[0].id // Usar un campo diferente para el ID personalizado
            }
          },
          currency: 'usd',
          unit_amount: rows[0].precio * 100
        },
        quantity: rows[0].cantidad
      })
    }

    const lineItems = productos.length > 0 ? productos : producto

    const link = await PagosStripe.checkout.sessions.create({
      line_items: lineItems,
      payment_method_types: ['card'],
      customer_email: usuario.emailAddresses[0].emailAddress,
      mode: 'payment',
      success_url: `${process.env.STRIPE_REDIRECCION}/u/compras`,
      cancel_url: `${process.env.STRIPE_REDIRECCION}/u/carrito`,
      payment_intent_data: {
        metadata: {
          userid: userId
        }
      },
      metadata: {
        userid: userId
      }
    })

    return res.status(200).json(link.url)
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
