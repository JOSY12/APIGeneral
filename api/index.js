import express from 'express'
import cors from 'cors'

import morgan from 'morgan'
import general from './routes/routergeneral.js'
import { paginacocina } from './db.js'
const PORT = process.env.PORT

const servidor = express()

servidor.use(express.json())

servidor.use(morgan('dev'))
servidor.use(express.urlencoded({ extended: true, limit: '50mb' }))

servidor.use(
  cors({
    origin: process.env.DEPLOY,
    credentials: true
  })
)

servidor.use(express.json({ limit: '50mb' }))

servidor.use(general)

try {
  await paginacocina.sync({ force: false })

  console.log(
    'conectado a basedatos Ecomerse:',
    process.env.POSTGRESDB ||
      'postgres://postgres:1212@localhost:5432/paginacocina'
  )
} catch (error) {
  console.log('error al intentar conectar a basedatos', error)
}
servidor.listen(PORT, () => {
  console.log(`server en linea puerto  ${PORT}`)
})
