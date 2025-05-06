import { DBPostgres } from '../BDPostgres.js'

import { Router } from 'express'
const rutasuriel = Router()
rutasuriel.get('/datos', async (req, res) => {
  try {
    const botones = await DBPostgres.query(
      'select * from uriel.acciones order by id'
    )
    // if (!botones.rows) return res.status(200).json('no hay botones creados')
    if (botones.rows) return res.status(200).json(botones.rows)
    if (!botones.rows) {
      return res.status(400).json({ error: 'sin datos que mostrar' })
    }
    return res.status(400).json({ error: 'algo salio mal con la peticios' })
  } catch (error) {
    return res.status(500).json({ error: 'error de peticion' })
  }
})

rutasuriel.put('/actualizar', async (req, res) => {
  const { id, encendido, blink } = req.body
  try {
    const botones = await DBPostgres.query(
      'UPDATE uriel.acciones SET encendido = $1, blink = $2 WHERE id = $3',
      [encendido, blink, id]
    )
    if (botones) return res.status(200).json(botones)
  } catch (error) {
    return res.status(500).json({ datos: 'error de peticio' })
  }
})
rutasuriel.delete(`/borrarpin/:id`, async (req, res) => {
  const { id } = req.params

  try {
    const borrado = await DBPostgres.query(
      'DELETE FROM uriel.acciones	WHERE id = $1',
      [id]
    )
    if (id) return res.status(200).json({ id: id }) // Respuesta correcta con el código de estado y el objeto
  } catch (error) {
    return res.status(500).json({ datos: 'error de peticion' })
  }
})

rutasuriel.post('/agregarpin', async (req, res) => {
  const { id, encendido } = req.body

  try {
    const encontrado = await DBPostgres.query(
      'select id from uriel.acciones where id = $1',
      [id]
    )
    if (encontrado.rows.length) {
      return res
        .status(200)
        .json({ error: `no puedes agregar el mismo GPIO${id} varias veces` })
    }
    const agregado = await DBPostgres.query(
      'insert into uriel.acciones (id,encendido) values ($1,$2) returning id',
      [id, encendido]
    )
    if (agregado) return res.status(200).json(agregado)
  } catch (error) {
    return res.status(500).json({ datos: 'error de peticio' })
  }
})

export default rutasuriel
