import { Router } from 'express'
import { DBPostgres } from '../../BDPostgres.js'
import { clerkClient } from '@clerk/express'

const clerkwebhook = Router()

clerkwebhook.post('/webhook', async (req, res) => {
  const evento = req.body
  const { id, email_addresses, first_name, image_url, last_name, username } =
    evento.data

  if (evento) {
    try {
      const usuario = await DBPostgres.query(
        'SELECT * FROM sena.usuarios WHERE id = $1',
        [id]
      )
      console.log(evento.type)
      console.log(evento)

      switch (evento.type) {
        case 'user.created':
          if (usuario.rows.length) {
            return res.status(400).json({ error: 'Usuario ya existe' })
          }
          const creado = await DBPostgres.query(
            'INSERT INTO sena.usuarios (id, email, nombre,foto_perfil,apellido,apodo) VALUES ($1, $2, $3, $4,$5,$6) returning id',
            [
              id,
              email_addresses[0].email_address,
              first_name,
              image_url,
              last_name,
              username === null ? first_name : username
            ]
          )
          if (!creado.rows.length) {
            return res.status(500).json({ error: 'error al crear el usuario' })
          }
          if (creado.rows.length) {
            // inserta el carrito dentro del usuario
            await DBPostgres.query(
              `insert into sena.Carritos (id) values($1)`,
              [id]
            )
            // inserta una entida compras a el usuario creado

            // await DBPostgres.query(
            //   'INSERT INTO sena.compras (id) values ($1)',
            //   [id]
            // )
            // inserta los atributos del usuario
            await DBPostgres.query(
              `INSERT INTO sena.Atributos_usuarios (id) values($1)`,
              [id]
            )

            await DBPostgres.query(
              `INSERT INTO sena.notificaciones (usuario_id,icono,titulo,descripcion) values($1,$2,$3,$4)`,
              [
                id,
                'https://res.cloudinary.com/rebelion/image/upload/v1748659564/nuevousuario_yije9z.png',
                'Registro Techsells',
                'Bienvenido a Techsells, tu tienda de tecnologia.'
              ]
            )
            if (
              username !== null &&
              first_name !== 'Example' &&
              email_addresses[0].email_address !== 'example@example.org'
            ) {
              await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                  administrador: false,
                  baneado: false,
                  rol: 'Comprador'
                }
              })
            }

            return res
              .status(200)
              .json({ message: 'Usuario creado correctamente' })
            // finaliza la creacion del usuario
          }

        case 'user.updated':
          if (!usuario.rows.length) {
            return res.status(400).json({ error: 'Usuario no existe' })
          }
          await DBPostgres.query(
            'UPDATE sena.usuarios SET email = $1, nombre = $2,foto_perfil = $3,apodo = $4 , apellido = $5 WHERE id = $6',
            [
              email_addresses[0].email_address,
              first_name,
              image_url,
              username === null ? first_name : username,
              last_name,
              id
            ]
          )

          if (
            username !== null &&
            first_name !== 'Example' &&
            email_addresses[0].email_address !== 'example@example.org'
          ) {
            await DBPostgres.query(
              'UPDATE sena.Atributos_usuarios SET administrador = $1, baneado = $2,rol = $3 WHERE id = $4',
              [
                evento.data.public_metadata.administrador,
                evento.publicMetadata.baneado,
                evento.publicMetadata.rol,
                id
              ]
            )
          }

          return res
            .status(200)
            .json({ message: 'Usuario actualizado correctamente' })
        // finaliza la actualizacion del usuario
        case 'user.deleted':
          if (!usuario.rows.length) {
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
