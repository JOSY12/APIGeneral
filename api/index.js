import express from 'express'
import cors from 'cors'
import { basedatos } from './db.js'
import { sincronisacion } from './EcomerseUno/models/Relaciones_Sincronisacion.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import ecomerseuno from './EcomerseUno/routes/ecomerseuno.js'
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

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/ecomerseuno', ecomerseuno)

servidor.listen(PORT, () => {
  console.log(
    `conectado a basedatos ${basedatos.config.database} }`,
    process.env.POSTGRESDB ||
      'postgres://postgres:1212@localhost:5432/basededatos'
  )
  console.log(`server en linea puerto  ${PORT}`)
})

try {
  // await basedatos.query('DROP SCHEMA IF EXISTS "EcomerseUno" CASCADE;')
  // console.log('esquema eliminado')
  // await basedatos.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  // console.log('esquema creado')

  sincronisacion.forEach((modelo) => {
    modelo.sync({ force: false }).then(() => {
      console.log(`modelo ${modelo.name} sincronizado   `)
    })
  })
} catch (error) {
  console.log(error)
}
