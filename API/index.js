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

// servidor.get('/', (req, res) => {
//   res.send()
// })

servidor.use(Express.static('public'))

servidor.get('/info', (req, res) => {
  res.json({
    db: process.env.POSTGRES_DOCKER,
    deploy: process.env.DEPLOY || 'No especificado'
  })
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
