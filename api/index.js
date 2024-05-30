import Express from 'express'
import cors from 'cors'
import { basedatos } from './db.js'
import { sincronisacion } from './EcomerseUno/models/Relaciones_Sincronisacion.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import ecomerseuno from './EcomerseUno/routes/ecomerseuno.js'
import 'dotenv/config'
import { usuarios } from './EcomerseUno/models/usuarios.js'

const PORT = process.env.PORT
const DEPLOY = process.env.DEPLOY
const servidor = Express()

servidor.use(
  Express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  })
)

servidor.use(morgan('dev'))
servidor.use(Express.urlencoded({ extended: true, limit: '50mb' }))

servidor.use(
  cors({
    origin: DEPLOY,
    credentials: true
  })
)

servidor.use(Express.json({ limit: '50mb' }))

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/ecomerseuno', ecomerseuno)

servidor.get('/', (req, res) => {
  res.send(
    `<div style="background-color: black; color: white; font-size: 2em; display: flex; justify-content: center; align-items: center; height: 100vh;">
      Servidor en linea y activo, Conectado a basedatos: ${process.env.POSTGRES_DOCKER}
    </div>`
  )
})

try {
  await basedatos.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  console.log('esquema creado')

  sincronisacion.forEach(modelo => {
    modelo.sync({ force: false }).then(() => {
      console.log(`modelo ${modelo.name} sincronizado   `)
    })
  })
  servidor.listen(PORT, () => {
    console.log(
      `conectado a basedatos: ${process.env.POSTGRES_DOCKER} `,
      process.env.POSTGRES_DOCKER === 'POSTGRES'
        ? process.env.URL_BASEDEDATOS_POSTGRES
        : process.env.URL_BASEDEDATOS_DOCKER
    )
    console.log(`server en linea puerto http://localhost:${PORT}`)
  })

  // await basedatos.query('DROP SCHEMA IF EXISTS "EcomerseUno" CASCADE;')
  // console.log('esquema eliminado')
} catch (error) {
  console.log(error)
}
