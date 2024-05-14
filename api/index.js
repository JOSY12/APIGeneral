import express from 'express'
import cors from 'cors'

import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import ecomerseuno from './EcomerseUno/routes/fastcheckout.js'
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
    'conectado a basedatos:',
    process.env.POSTGRESDB ||
      'postgres://postgres:1212@localhost:5432/basededatos'
  )
  console.log(`server en linea puerto  ${PORT}`)
})
