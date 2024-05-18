import Express from 'express'
import cors from 'cors'
import { basedatos } from './db.js'
import { sincronisacion } from './EcomerseUno/models/Relaciones_Sincronisacion.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import ecomerseuno from './EcomerseUno/routes/ecomerseuno.js'
const PORT = process.env.PORT
const DEPLOY = process.env.DEPLOY
const servidor = Express()

servidor.use(Express.json())

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
  res.send('Servidor en linea ')
})

try {
  servidor.listen(PORT, () => {
    console.log(
      `conectado a basedatos  }`,
      process.env.POSTGRESDB ||
        'postgres://postgres:1212@localhost:5432/basededatos'
    )
    console.log(`server en linea puerto  ${PORT}`)
  })
  // await basedatos.query('DROP SCHEMA IF EXISTS "EcomerseUno" CASCADE;')
  // console.log('esquema eliminado')
  await basedatos.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  console.log('esquema creado')

  sincronisacion.forEach((modelo) => {
    modelo.sync({ force: false }).then(() => {
      console.log(`modelo ${modelo.name} sincronizado   `)
    })
  })
} catch (error) {
  console.log(error)
}
