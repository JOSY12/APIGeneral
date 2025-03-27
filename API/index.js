import Express from 'express'
import cors from 'cors'
import { basedatospostgres } from './Postgres.js'
// import { sincronisacion } from './EcomerseUno/models/Relaciones_Sincronisacion.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import sena_index from './Sena/Routes/Sena_index.js'
import 'dotenv/config'
// import { usuarios } from './EcomerseUno/models/usuarios.js'

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
console.log(DEPLOY)
servidor.use(Express.json({ limit: '50mb' }))

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/sena', sena_index)

servidor.get('/', (req, res) => {
  res.send(
    `<div style="background-color: black; color: #59ff50; font-size: 2em; display: flex; justify-content: center; align-items: center; height: 100vh;">
      Servidor en linea y activo , Conectado a base de datos : ${process.env.POSTGRES_DOCKER}
    </div>`
  )
})

try {
  // await basedatos.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  // await basedatos.query('CREATE SCHEMA IF NOT EXISTS sena;')

  await basedatospostgres.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  await basedatospostgres.query('CREATE SCHEMA IF NOT EXISTS sena;')

  // sincronisacion.forEach(modelo => {
  //   modelo.sync({ force: false }).then(() => {
  //     console.log(`modelo ${modelo.name} sincronizado   `)
  //   })
  // })
  servidor.listen(PORT, () => {
    console.log(
      `conectado a basedatos: ${process.env.POSTGRES_DOCKER} `,
      process.env.POSTGRES_DOCKER === 'POSTGRES'
        ? process.env.URL_BASEDEDATOS_POSTGRES
        : process.env.URL_BASEDEDATOS_DOCKER
    )
    console.log(`server en linea puerto http://localhost:${PORT}`)
  })
} catch (error) {
  console.log(error)
}
