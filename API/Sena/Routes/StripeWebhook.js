import { Router } from 'express'
import PagosStripe from '../../Stripe.js'
import { DBPostgres } from '../../BDPostgres.js'
const secreto = process.env.STRIPE_WEBHOOK_SECRET
const stripewebhook = Router()

stripewebhook.post('/webhook', async (req, res) => {
  let event = req.body

  if (secreto) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']

    try {
      event = PagosStripe.webhooks.constructEvent(req.body, signature, secreto)

      const usuario = await DBPostgres.query(
        ' select id from sena.usuarios WHERE id = $1',
        [event.data.object.metadata.userid]
      )

      switch (event.type) {
        // case 'payment_intent.created':
        //   const paymentIntentCreated = event.data.object
        //   console.log('PaymentIntent creado:')
        //   const pagointent = await DBPostgres.query(
        //     'select id from sena.compras where pago_id_compra = $1',
        //     [paymentIntentCreated.id]
        //   )

        //   if (pagointent.rows.length === 0) {
        //     await DBPostgres.query(
        //       'INSERT INTO sena.compras (usuario_id,sesion_id_compra,pago_id_compra,estado) values($1,$2,$3,$4)',
        //       [
        //         usuario.rows[0].id,
        //         'vacio',
        //         paymentIntentCreated.id,
        //         'Compra creada'
        //       ]
        //     )
        //     await DBPostgres.query(
        //       `INSERT INTO sena.notificaciones (usuario_id,titulo,descripcion) values($1,$2,$3)`,
        //       [
        //         usuario.rows[0].id,
        //         'Compra creada',
        //         'Compra creada exitosamente con id: ' + paymentIntentCreated.id
        //       ]
        //     )
        //   } else {
        //     await DBPostgres.query(
        //       'update sena.compras set estado = $1 where pago_id_compra = $2',
        //       ['Compra creada', paymentIntentCreated.id]
        //     )
        //     await DBPostgres.query(
        //       `INSERT INTO sena.notificaciones (usuario_id,titulo,descripcion) values($1,$2,$3)`,
        //       [
        //         usuario.rows[0].id,
        //         'Compra creada',
        //         'Compra creada exitosamente con id: ' + paymentIntentCreated.id
        //       ]
        //     )
        //   }

        //   break

        // case 'payment_intent.succeeded':
        //   const paymentIntentSucceeded = event.data.object
        //   console.log('PaymentIntent pago de compra exitoso:')

        //   const paymentintid = await DBPostgres.query(
        //     ' select id from sena.compras where pago_id_compra = $1',
        //     [paymentIntentSucceeded.id]
        //   )

        //   if (paymentintid.rows.length) {
        //     await DBPostgres.query(
        //       'update sena.compras set estado = $1 where pago_id_compra = $2',
        //       ['Pago exitoso', paymentIntentSucceeded.id]
        //     )
        //     await DBPostgres.query(
        //       `INSERT INTO sena.notificaciones (usuario_id,titulo,descripcion) values($1,$2,$3)`,
        //       [
        //         usuario.rows[0].id,
        //         'Pago exitosa',
        //         `Compra  ${paymentIntentSucceeded.id} procesada exitosamente`
        //       ]
        //     )
        //   } else {
        //     await DBPostgres.query(
        //       'INSERT INTO sena.compras (usuario_id,sesion_id_compra,pago_id_compra,estado) values($1,$2,$3,$4)',
        //       [
        //         usuario.rows[0].id,
        //         'vacio',
        //         paymentIntentSucceeded.id,
        //         'Pago exitoso'
        //       ]
        //     )
        //     await DBPostgres.query(
        //       `INSERT INTO sena.notificaciones (usuario_id,titulo,descripcion) values($1,$2,$3)`,
        //       [
        //         usuario.rows[0].id,
        //         'Compra Pagada exitosamente',
        //         `id de la Compra  ${paymentIntentSucceeded.id}, procesada exitosamente`
        //       ]
        //     )
        //   }

        //   break

        case 'checkout.session.completed':
          const sessionCompleted = event.data.object

          const compracompletada = await DBPostgres.query(
            'select id from sena.compras where pago_id_compra = $1',
            [sessionCompleted.payment_intent]
          )

          if (compracompletada.rows.length) {
            await DBPostgres.query(
              'update sena.compras set estado = $1,sesion_id_compra = $2 where pago_id_compra = $3',
              [
                'Compra exitosa',
                sessionCompleted.id,
                sessionCompleted.payment_intent
              ]
            )
            await DBPostgres.query(
              `INSERT INTO sena.notificaciones (usuario_id,icono,titulo,descripcion) values($1,$2,$3,$4)`,
              [
                usuario.rows[0].id,
                'https://res.cloudinary.com/rebelion/image/upload/v1748659564/pagocompletado_zv6iq4.png',
                'Compra exitosa',
                `Compra finalizada exitosamente,  los productos comprados se mostraran en la seccion de compras, id de la sesion: ${sessionCompleted.id}`
              ]
            )
          } else {
            // aqui se agrega la direccion de entrega y el metodo de envio

            await DBPostgres.query(
              'INSERT INTO sena.compras (usuario_id,sesion_id_compra,pago_id_compra,estado,enviado) values($1,$2,$3,$4,false)',
              [
                usuario.rows[0].id,
                sessionCompleted.id,
                sessionCompleted.payment_intent,
                'Compra exitosa'
              ]
            )

            await DBPostgres.query(
              `INSERT INTO sena.notificaciones (usuario_id,icono,titulo,descripcion) values($1,$2,$3,$4)`,
              [
                usuario.rows[0].id,
                'https://res.cloudinary.com/rebelion/image/upload/v1748659564/pagocompletado_zv6iq4.png',
                'Compra exitosa',
                `Compra finalizada exitosamente,  los productos comprados se mostraran en la seccion de compras, id de la sesion: ${sessionCompleted.id}`
              ]
            )

            const encontrado = await DBPostgres.query(
              'select * from sena.direcciones_usuarios where usuario_id = $1 and predeterminada = true',
              [usuario.rows[0].id]
            )
            if (encontrado.rows.length) {
              await DBPostgres.query(
                `INSERT INTO sena.direcciones_compras (id,nombre_comprador,ciudad,direccion,nota,telefono,codigo_postal) values($1,$2,$3,$4,$5,$6,$7)`,
                [
                  sessionCompleted.id,
                  encontrado.rows[0].nombre_comprador,
                  encontrado.rows[0].ciudad,
                  encontrado.rows[0].direccion,
                  encontrado.rows[0].nota,
                  encontrado.rows[0].telefono,
                  encontrado.rows[0].codigo_postal
                ]
              )
            }

            const session = await PagosStripe.checkout.sessions.retrieve(
              sessionCompleted.id,
              {
                expand: ['line_items.data.price.product']
              }
            )

            for (const item of session.line_items.data) {
              await DBPostgres.query(
                'INSERT INTO sena.Compras_Productos (sesion_id_compra,producto_id,cantidad) values($1,$2,$3)',
                [
                  sessionCompleted.id,
                  item.price.product.metadata.product_id,
                  item.quantity
                ]
              )
            }
            for (let e of session.line_items.data) {
              await DBPostgres.query(
                ' DELETE from sena.carritos_productos WHERE carrito_id = $1 AND producto_id = $2',
                [usuario.rows[0].id, e.price.product.metadata.product_id]
              )
            }
            for (let e of session.line_items.data) {
              await DBPostgres.query(
                'update sena.productos set stock = stock - $1 where id = $2',
                [e.quantity, e.price.product.metadata.product_id]
              )
            }
          }

          break

        case 'payment_intent.payment_failed':
          const paymentFailed = event.data.object
          // se puede mejorar para que se envie el id del carrito o el id individual
          // de la compra y enviar mensaje de que fue lo que se intenteo comprar

          const pagofallido = await DBPostgres.query(
            ' select id from sena.compras where pago_id_compra = $1',
            [paymentFailed.id]
          )

          if (pagofallido.rows.length === 0) {
            await DBPostgres.query(
              'INSERT INTO sena.compras (usuario_id,sesion_id_compra,pago_id_compra,estado.enviado) values($1,$2,$3,$4,false)',
              [usuario.rows[0].id, 'vacio', paymentFailed.id, 'Compra fallida']
            )
            await DBPostgres.query(
              `INSERT INTO sena.notificaciones (usuario_id,icono,titulo,descripcion) values($1,$2,$3,$4)`,
              [
                usuario.rows[0].id,
                'https://res.cloudinary.com/rebelion/image/upload/v1748661174/errorcompra_dikpyu.png',
                'itento de compra fallido',
                'falla al hacer la compra ' + paymentFailed.id
              ]
            )
            break
          }

          break

        case 'payment_intent.processing':
          const paymentProcessing = event.data.object
          // Manejar el evento payment_intent.processing
          break

        case 'payment_intent.canceled':
          const paymentCanceled = event.data.object

          const pagocancelado = await DBPostgres.query(
            ' select id from sena.compras where pago_id_compra = $1',
            [paymentCanceled.id]
          )

          if (pagocancelado.rows.length) {
            await DBPostgres.query(
              'update sena.compras set estado = $1 where pago_id_compra = $2',
              ['Pago cancelado', paymentCanceled.id]
            )
            await DBPostgres.query(
              `INSERT INTO sena.notificaciones (usuario_id,titulo,descripcion) values($1,$2,$3)`,
              [
                usuario.rows[0].id,
                'Pago cancelado',
                'Compra cancelada' + paymentCanceled.id
              ]
            )
          }

          break

        default:
          console.log(`alerta entro un evento sin manejar: ${event.type}`)
      }
    } catch (err) {
      console.log(`⚠️  fallo al recibir o procesar webhook.`, err.message)
      return res.status(400)
    }
  } else {
    console.log(
      '⚠️  fallo al recibir o procesar webhook. Secreto no configurado'
    )
    return res.status(400).json({ error: 'token Secreto no configurado' })
  }

  return res.json({ recibido: true })
})

export default stripewebhook
