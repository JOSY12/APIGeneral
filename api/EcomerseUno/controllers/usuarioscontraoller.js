import { carrito } from '../models/carrito.js'
import { favoritos } from '../models/favoritos.js'
import { producto } from '../models/producto.js'
import { usuarios } from '../models/usuarios.js'

///aqui se registra al usuario
export const registrarusuario = async (req, res) => {
  const { nombre, contrasena, correo } = req.body

  try {
    if (!nombre || !contrasena || !correo) {
      return res.status(500).json({
        errores: [
          {
            error: 'usuarios',
            mensaje: `falta ${!nombre ? 'nombre' : ''}${
              !contrasena ? 'contrasena' : ''
            }${!correo ? 'correo' : ''}`
          }
        ]
      })
    }
    if (await usuarios.findOne({ where: { correo } })) {
      return res.status(500).json({
        errores: [
          {
            error: 'usuarios',
            mensaje: 'el correo ya esta registrado'
          }
        ]
      })
    }
    const nuevoUsuario = await usuarios.create({ nombre, contrasena, correo })

    if (nuevoUsuario) {
      const Carrito = await carrito.create()
      const Favoritos = await favoritos.create()

      await nuevoUsuario.setCarrito(Carrito)
      await nuevoUsuario.setFavorito(Favoritos)

      return res.status(200).json({ Registro: { nombre, contrasena, correo } })
    } else {
      return res.status(500).json({
        errores: [
          {
            error: 'usuarios',
            mensaje: 'No se pudo registrar el usuario'
          }
        ]
      })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ errores: { error: error, message: 'hubo un error' } })
  }
}

// aqui comienza inciar sesion
export const iniciarsesion = async (req, res) => {
  const { correo, contrasena } = req.body

  try {
    if (!correo || !contrasena) {
      return res.status(500).json({
        errores: [
          {
            model: 'usuario',
            mensaje: `Falta ${!contrasena ? 'contrasena' : 'correo'}`
          }
        ]
      })
    }
    const usuario = await usuarios.findOne({
      where: { correo, contrasena }
    })

    if (usuario) {
      return res.status(200).json({ usuario })
    }
    if (!usuario || usuario === null) {
      return res.status(404).json({
        errores: [
          {
            model: 'usuarios',
            mensaje: 'la cuenta no existe'
          }
        ]
      })
    }
  } catch (error) {
    return res.status(500).json({ mensaje: `hubo un error ${error}` })
  }
}
// aqui se obtiene los datos del usuario
export const datosusuarios = async (req, res) => {
  const { id } = req.params

  try {
    if (!id) {
      return res.status(500).json({
        errores: [
          {
            error: 'usuario',
            mensaje: `Falta ${!id ? 'contrasena' : 'correo'}`
          }
        ]
      })
    }
    const usuario = await usuarios.findOne(
      { where: { id } },
      {
        include: [
          {
            model: favoritos,
            include: [
              {
                model: producto,
                through: { attributes: [] }
              }
            ]
          }
        ]
      }
    )

    if (!usuario || usuario === null) {
      return res.status(404).json({
        errores: [
          {
            error: 'usuarios',
            mensaje: 'la cuenta no existe'
          }
        ]
      })
    }

    if (usuario) {
      return res.status(200).json({ usuario })
    }
  } catch (error) {
    return res.status(500).json({
      errores: [
        {
          error: 'usuarios',
          mensaje: error
        }
      ]
    })
  }
}
