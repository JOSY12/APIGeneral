import { DBPostgres } from '../../BDPostgres.js'
import { getAuth } from '@clerk/express'

export const todos_usuarios = async (req, res) => {
  try {
    const usuarios = await DBPostgres.query(
      'select * from sena.admin_todos_usuarios'
    )

    const datos = await DBPostgres.query('select * from sena.datos_techsells')
    if (!usuarios.rows.length) {
      return res
        .status(404)
        .json({ error: 'no existen usuarios en la base de datos' })
    }
    return res.status(200).json({ usuarios: usuarios.rows, datos: datos.rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const borrar_usuarios = async (req, res) => {
  const { id } = req.params
  //verifica que los datos enviados existan o se rechaza la peticion
  if (!id) {
    return res.status(400).json({
      Error: 'Faltan campos'
    })
  }

  try {
    //      1. Verificar si el usuario existe por medio de subconsulta (con parámetros seguros)
    const usuarioExistente = await DBPostgres.query(
      ' select exists( SELECT id FROM sena.usuarios WHERE id = $1) ',
      [id]
    )
    if (!usuarioExistente.rows[0].exists) {
      return res.status(400).json({ Existe: 'El usuario no existe' })
    }
    // 2. Borrar usuario (con parámetros seguros)
    const { rows } = await DBPostgres.query(
      'delete from sena.usuarios where id = $1 returning id',
      [id]
    )
    // 3. Borrar carrito y favoritos (en paralelo)
    await DBPostgres.query(
      `delete from sena.carritos where id = $1 returning id`,
      [id]
    )
    await DBPostgres.query(
      `delete from sena.favoritos where id = $1 returning id`,
      [id]
    )
    // 4. Verificar si el usuario fue
    // borrado correctamente

    const usuarioBorrado = rows.length > 0

    if (!usuarioBorrado) {
      return res.status(404).json({ error: 'usuario no encontrado' })
    }

    return res
      .status(200)
      .json({ Borrado: rows, mensaje: 'Usuario borrado correctamente' })
  } catch (error) {
    // Manejo de errores

    return res.status(500).json({
      errores: error
    })
  }
}

export const Actualizar_usuarios = async (req, res) => {
  const { userId } = getAuth(req)
  //verifica que los datos enviados existan o se rechaza la peticion
  if (!nombre || !edad || !email || !claveacceso || !id) {
    return res.status(400).json({
      Error: 'Faltan campos'
    })
  }

  try {
    const { rows } = await DBPostgres.query(
      `UPDATE sena.usuarios 
       SET nombre = $1, edad = $2, email = $3, claveacceso = $4 
       WHERE id = $5 returning id `,
      [nombre, edad, email, claveacceso, id]
    )
    if (!rows.length) {
      return res.status(404).json({ error: `el usuario con ${id} no existe` })
    }

    return res.status(200).json({ Actualizado: rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const perfil_usuarios = async (req, res) => {
  const { userId } = getAuth(req)
  try {
    const { rows } = await DBPostgres.query(
      `select * from sena.usuarios where id = $1`,
      [userId]
    )

    if (!rows.length) {
      return res.status(404).json({ Perfil: 'perfil no encontrado' })
    }
    return res.status(200).json({ Perfil: rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const Actualizar_usuarios_admin = async (req, res) => {
  const { nombre, edad, email, claveacceso } = req.body
  const { id } = req.params
  try {
    const { rows } = await DBPostgres.query(
      `UPDATE sena.usuarios 
       SET nombre = $1, edad = $2, email = $3, claveacceso = $4 
       WHERE id = $5 returning id `,
      [nombre, edad, email, claveacceso, id]
    )
    if (!rows.length) {
      return res.status(404).json({ error: `el usuario con ${id} no existe` })
    }

    return res.status(200).json({ Actualizado: rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const borrar_usuarios_admin = async (req, res) => {
  const { userId } = getAuth(req)
  try {
    const { rows } = await DBPostgres.query(
      'delete from sena.usuarios where id = $1 returning id',
      [userId]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'usuario no encontrado' })
    }

    return res.status(200).json({ Borrado: rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const notificaciones = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT * FROM sena.usuario_notificaciones WHERE usuario_id = $1 ORDER BY fecha_creacion desc`,
        [userId]
      )
      if (rows) {
        return res.status(200).json(rows)
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const borrar_notificacion = async (req, res) => {
  const { userId } = getAuth(req)
  const { id } = req.params
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `DELETE FROM sena.notificaciones WHERE id = $1 AND usuario_id = $2`,
        [id, userId]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const borrar_todas_notificaciones = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `DELETE FROM sena.Notificaciones WHERE usuario_id = $1 returning id`,
        [userId]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const contador_notificaciones = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT  COUNT(visto) FILTER(WHERE visto = false) FROM sena.notificaciones WHERE usuario_id = $1  `,
        [userId]
      )
      if (rows) {
        return res.status(200).json(rows[0].count)
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const marcar_visto = async (req, res) => {
  const { userId } = getAuth(req)

  if (userId) {
    try {
      await DBPostgres.query(
        `UPDATE sena.Notificaciones n SET visto = true WHERE n.usuario_id = $1 `,
        [userId]
      )

      return res.status(200).json('exito')
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

// favoritos

export const favoritos = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT * FROM sena.todos_favoritos WHERE usuario_id = $1`,
        [userId]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const agregar_favorito = async (req, res) => {
  const { userId } = getAuth(req)
  const { idfavorito } = req.body
  if (userId) {
    try {
      const encontrado = await DBPostgres.query(
        'select * from sena.favoritos where usuario_id = $1 and producto_id = $2',
        [userId, idfavorito]
      )
      if (!encontrado.rows.length) {
        await DBPostgres.query(
          `INSERT INTO sena.favoritos (usuario_id,producto_id) values($1,$2)`,
          [userId, idfavorito]
        )
        return res.status(200).json('exito')
      } else if (encontrado.rows.length) {
        return res.status(200).json('ya existe')
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const quitar_favorito = async (req, res) => {
  const { userId } = getAuth(req)
  const { id } = req.params
  if (userId) {
    try {
      await DBPostgres.query(
        `delete from  sena.favoritos where producto_id = $1 and usuario_id = $2`,
        [id, userId]
      )

      return res.status(200).json('exito')
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

// CARRITO

export const carrito = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT* FROM sena.solicitar_carrito_usuario WHERE carrito_id = $1`,
        [userId]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const historial_compras = async (req, res) => {
  const { userId } = getAuth(req)
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT* FROM sena.compras_usuario WHERE usuario_id = $1 `,
        [userId]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const detalle_compra = async (req, res) => {
  const { userId } = getAuth(req)
  const { id } = req.params
  if (userId) {
    try {
      const { rows } = await DBPostgres.query(
        `SELECT * FROM sena.detalle_Compra WHERE sesion_id_compra = $1`,
        [id]
      )
      if (rows) {
        return res.status(200).json({ rows })
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const agregar_carrito = async (req, res) => {
  const { userId } = getAuth(req)
  const { idproducto, cantidad } = req.body
  if (userId) {
    try {
      const encontrado = await DBPostgres.query(
        'select * from sena.carritos_productos where carrito_id = $1 and producto_id = $2',
        [userId, idproducto]
      )
      if (!encontrado.rows.length) {
        await DBPostgres.query(
          `INSERT INTO sena.carritos_productos (carrito_id,producto_id,cantidad) values($1,$2 ,$3)`,
          [userId, idproducto, cantidad ? cantidad : 1]
        )
        return res.status(200).json('exito')
      } else if (encontrado.rows.length) {
        return res.status(200).json('ya existe')
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const quitar_carrito = async (req, res) => {
  const { userId } = getAuth(req)
  const { id } = req.params
  if (userId) {
    try {
      await DBPostgres.query(
        `delete from  sena.carritos_productos where producto_id = $1 and carrito_id = $2`,
        [id, userId]
      )

      return res.status(200).json('exito')
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const modificar_cantidad = async (req, res) => {
  const { userId } = getAuth(req)
  const { idproducto, cantidad } = req.body
  if (userId) {
    try {
      const encontrado = await DBPostgres.query(
        'select * from sena.carritos_productos where carrito_id = $1 and producto_id = $2',
        [userId, idproducto]
      )
      if (encontrado.rows.length) {
        await DBPostgres.query(
          `UPDATE sena.carritos_productos SET cantidad = $1 WHERE carrito_id = $2 AND producto_id = $3`,
          [cantidad, userId, idproducto]
        )
        return res.status(200).json('exito actualizando')
      } else if (encontrado.rows.length) {
        return res.status(200).json('sin cambio')
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}

export const agregar_direccion = async (req, res) => {
  const { userId } = getAuth(req)
  const { Nombre, Telefono, Direccion, Postal, Ciudad, Detalles } = req.body
  if (userId) {
    try {
      const encontrado = await DBPostgres.query(
        'select * from sena.favoritos where usuario_id = $1 and producto_id = $2',
        [userId, idfavorito]
      )
      if (!encontrado.rows.length) {
        await DBPostgres.query(
          `INSERT INTO sena.favoritos (usuario_id,producto_id) values($1,$2)`,
          [userId, idfavorito]
        )
        return res.status(200).json('exito')
      } else if (encontrado.rows.length) {
        return res.status(200).json('ya existe')
      }
    } catch (error) {
      return res.status(500).json({ Error: error })
    }
  }
  return res.status(400).json({ Error: 'no se recivio usuario' })
}
