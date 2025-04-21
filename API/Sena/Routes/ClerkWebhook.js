import { Router } from 'express'
import { DBPostgres } from '../../BDPostgres.js'
import { clerkClient } from '@clerk/express'

const clerkwebhook = Router()

clerkwebhook.post('/webhook', async (req, res) => {
  const evento = req.body
  console.log(evento.type)
  const { id, email_addresses, first_name } = evento.data
  if (evento) {
    try {
      const usuario = await DBPostgres.query(
        'SELECT * FROM sena.usuarios WHERE id = $1',
        [id]
      )
      console.log('usuario:', usuario.rows)

      switch (evento.type) {
        case 'user.created':
          if (usuario.rows.length) {
            console.log({ error: 'Usuario ya existe' })
            return res.status(400).json({ error: 'Usuario ya existe' })
          }
          const creado = await DBPostgres.query(
            'INSERT INTO sena.usuarios (id, email, nombre) VALUES ($1, $2, $3) returning id',
            [id, email_addresses[0].email_address, first_name]
          )
          console.log('creado:', creado.rows)
          if (creado.rows.length) {
            // inserta el carrito dentro del usuario
            await DBPostgres.query(
              `insert into sena.Carritos (id) values($1)`,
              [id]
            )
            // inserta los atributos del usuario
            await DBPostgres.query(
              `INSERT INTO sena.AtributosUsuarios (id,administrador,baneado) values($1,FALSE,FALSE)`,
              [id]
            )
            await clerkClient.users.updateUserMetadata(id, {
              publicMetadata: {
                administrador: false,
                baneado: false
              }
            })
          }

          if (!creado.rows.length) {
            console.log({ error: 'Usuario no se creo correctamente', creado })

            return res.status(500).json({ error: 'error al crear el usuario' })
          }
          console.log('Usuario creado:', id)
          return res
            .status(200)
            .json({ message: 'Usuario creado correctamente' })
        // finaliza la creacion del usuario
        case 'user.updated':
          if (!usuario.rows.length) {
            console.log({ error: 'Usuario no existe' })
            return res.status(400).json({ error: 'Usuario no existe' })
          }
          // await DBPostgres.query(
          //   'UPDATE sena.usuarios SET email = $1, nombre = $2  WHERE id = $3',
          //   [email_addresses[0].email_address, first_name, id]
          // )
          console.log('Usuario actualizado:', evento.data)

          console.log('Usuario actualizado:', actualizado)
          return res
            .status(200)
            .json({ message: 'Usuario actualizado correctamente' })
        // finaliza la actualizacion del usuario
        case 'user.deleted':
          if (!usuario.rows.length) {
            console.log({ error: 'Usuario no existe' })
            // Eliminar el usuario de la base de datos

            return res.status(400).json({ error: 'Usuario no existe' })
          }
          // Eliminar el usuario de la base de datos
          // Puedes usar el ID del evento para identificar al usuario
          await DBPostgres.query('DELETE FROM sena.usuarios WHERE id = $1 ', [
            id
          ])
          await DBPostgres.query(`delete from sena.Carritos where id = $1`, [
            id
          ])
          await DBPostgres.query(
            `delete from sena.AtributosUsuarios where id = $1
 `,
            [id]
          )
          console.log('Usuario eliminado', id)
          return res
            .status(200)
            .json({ message: 'Usuario eliminado correctamente' })
        // finaliza la eliminacion del usuario
        default:
          return res.status(400).json({ error: 'Evento no manejado' })
      }
    } catch (error) {
      return res.status(500).json({ error: 'error en webhook' })
    }
  }
  return res
    .status(400)
    .json({ error: 'Evento no manejado error al recibir peticion' })
})

export default clerkwebhook
