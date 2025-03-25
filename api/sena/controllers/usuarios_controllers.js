import { basedatospostgres } from '../../db.js'

export const crear_usuario = async (req, res) => {
  const { nombre, email, edad, claveacceso } = req.body

  try {
    if (!nombre || !email || !edad || !claveacceso) {
      await basedatospostgres.end()
      return res
        .status(400)
        .json(
          `usuario no insertado correctamente, variables faltantes nombre: ${nombre}, edad: ${edad}, email: ${email},clave: ${claveacceso}`
        )
    }
    const { rows } = await basedatospostgres.query(
      `insert into sena.usuarios (nombre,email,edad,claveacceso) values('${nombre}','${email}',${edad},'${claveacceso}' ) returning id`
    )

    if (rows[0].id) {
      await basedatospostgres.query(
        ` INSERT INTO sena.carritos (id) values(${rows[0].id})`
      )
      await basedatospostgres.query(
        `insert into sena.favoritos (id) values(${rows[0].id})`
      )
      await basedatospostgres.end()
      return res.status(200).json('usuario insertado correctamente')
    }
  } catch (error) {
    return res.status(500).json({
      errores: `no se pudo ingrear el usuario nombre: ${nombre}, edad: ${edad}, email: ${email},clave: ${claveacceso}`,
      sql: error
    })
  }
}

export const todos_usuarios = async (req, res) => {
  try {
    const { rows } = await basedatospostgres.query(
      'SELECT nombre,edad,email FROM sena.usuarios;'
    )

    return res.status(200).json({ tablas: rows })
  } catch (error) {
    return res.status(500).json({
      errores: error
    })
  }
}
