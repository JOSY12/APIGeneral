import Express from 'express'
import cors from 'cors'
import { DBPostgres } from './BDPostgres.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import senaindex from './Sena/Routes/Index_sena.js'
import 'dotenv/config'

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

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || DEPLOY.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true
}

servidor.use(cors(corsOptions))
// configuracion para multiples peticiones

// servidor.use(
//   cors({
//     origin: DEPLOY,
//     credentials: true
//   })
// )

servidor.use(Express.json({ limit: '50mb' }))

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/sena', senaindex)

servidor.get('/', (req, res) => {
  res.send(
    `<div style="background-color: black; color: #59ff50; font-size: 2em; display: flex; justify-content: center; align-items: center; height: 100vh;">
      Servidor en linea y activo , Conectado a base de datos : ${process.env.POSTGRES_DOCKER},
    </div>
    
    <div style="background-color: black; color: #59ff50; font-size: 2em; display: flex; justify-content: center; align-items: center;  ">
    Rutas activas ${DEPLOY}
    </div>

    `
  )
})

try {
  // await basedatospostgres.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  await DBPostgres.query('CREATE SCHEMA IF NOT EXISTS sena;')

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
