import { Mercadopago } from '../../MercadoPago.js'
import { v4 as uuidv4 } from 'uuid'
export const crearcompra = async (req, res) => {
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
          id: i + 1,
          title: element.nombre,
          unit_price: element.precio * 10,
          quantity: element.cantidad
        })
      }
    }

    const body = {
      items: comprando,

      binary_mode: true,

      payer: {
        name: 'Josue',
        surname: 'Perez',
        email: '5Tqz0@example.com'
      },

      back_urls: {
        success: `${process.env.DEPLOY}/exito`,
        failure: `${process.env.DEPLOY}/fallo`
      },
      auto_return: 'approved'
    }

    await Mercadopago.create({
      body,
      idempotencyKey: uuidv4()
    }).then((result) => {
      console.log(result)
      return res.status(200).json(result.init_point)
    })
  } catch (error) {
    return res.status(500).json({
      mensaje: `hubo un error ${error} no se pudo crear la compra`
    })
  }
}
