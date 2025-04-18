import { DBPostgres } from '../../BDPostgres.js'
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
//se crea el usuarios segun sun datos
export const crear_usuarios = async (req, res) => {
  let { id, name, email } = req.body
  //verifica que los datos enviados existan o se rechaza la peticion
  if (!id || !name || !email) {
    return res.status(400).json({
      Error: 'Faltan campos'
    })
  }
  //verifica que el usuario no exista
  const existe = await DBPostgres.query(
    `select * from sena.usuarios where email = $1 `,
    [email]
  )
  if (existe.rows.length) {
    return res.status(400).json({ error: 'el usuarios ya existe' })
  }

  try {
    const nuevoUsuario = await DBPostgres.query(
      `INSERT INTO sena.usuarios (id, nombre, email) VALUES ($1, $2, $3) RETURNING id`,
      [id, name, email]
    )
    return res.status(201).json({ id: nuevoUsuario.rows[0].id })
  } catch (error) {
    return res.status(500).json({ Error: error })
  }
}

export const todos_usuarios = async (req, res) => {
  try {
    const { rows } = await DBPostgres.query(
      'SELECT id,nombre,email FROM sena.usuarios;'
    )
    console.log(rows)
    if (!rows.length) {
      return res
        .status(404)
        .json({ error: 'no existen usuarios en la base de datos' })
    }
    return res.status(200).json({ Usuarios: rows })
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
  const { nombre, edad, email, claveacceso } = req.body
  const { id } = req.params
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
    console.log(rows)
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
  const { id } = req.params

  try {
    const { rows } = await DBPostgres.query(
      `select * from sena.usuarios where id = $1`,
      [id]
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

export const inciarsesion_usuarios = async (req, res) => {
  const { email, claveacceso } = req.body
  console.log(email, claveacceso)
  try {
    const existe = await DBPostgres.query(
      `select * from sena.usuarios where email = $1 `,
      [email]
    )
    if (!existe.rows.length) {
      return res.status(404).json({ error: 'el usuarios no existe' })
    }

    if (existe.rows[0].email && claveacceso) {
      const { rows } = await DBPostgres.query(
        `select * from sena.usuarios where email = $1 and claveacceso = $2`,
        [email, claveacceso]
      )

      if (rows.length) {
        return res.status(200).json({ Usuario: rows })
      } else {
        return res.status(404).json({ error: 'clave o correo incorrectos' })
      }
    }
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}

export const Cerrar_sesion = async (req, res) => {
  const { email, claveacceso } = req.body
  console.log(email, claveacceso)
  try {
    // se borra todo los datos temporales de la pagina por seguridad del usuarios
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
    console.log(rows)
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
  const { id } = req.params
  try {
    const { rows } = await DBPostgres.query(
      'delete from sena.usuarios where id = $1 returning id',
      [id]
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
