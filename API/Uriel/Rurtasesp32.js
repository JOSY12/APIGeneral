import { DBPostgres } from '../BDPostgres.js'

import { Router } from 'express'
const rutasuriel = Router()
// [] cambie el localhost en deploy si algo no sirve recolocarlo
rutasuriel.get('/datos', async (req, res) => {
  try {
    const botones = await DBPostgres.query(
      'select * from uriel.acciones order by id'
    )
    // if (!botones.rows) return res.status(200).json('no hay botones creados')
    if (botones.rows) return res.status(200).json(botones.rows)
    if (!botones.rows) {
      return res.status(400).json({ error: 'no hay datos que mostrar' })
    }
    return res.status(400).json({ error: 'algo salio mal con la peticios' })
  } catch (error) {
    return res.status(500).json({ error: 'error de peticion' })
  }
})

rutasuriel.put('/actualizar', async (req, res) => {
  const { id, encendido } = req.body
  try {
    const botones = await DBPostgres.query(
      'UPDATE uriel.acciones SET encendido = $1 WHERE id = $2 RETURNING id',
      [encendido, id]
    )
    if (botones) return res.status(200).json(botones)
  } catch (error) {
    return res.status(500).json({ datos: 'error de peticio' })
  }
})

rutasuriel.post('/agregar', async (req, res) => {
  const { id, encendido } = req.body
  try {
    const botones = await DBPostgres.query(
      'UPDATE uriel.acciones SET encendido = $1 WHERE id = $2 RETURNING id',
      [encendido, id]
    )
    if (botones) return res.status(200).json(botones)
  } catch (error) {
    return res.status(500).json({ datos: 'error de peticio' })
  }
})

export default rutasuriel
