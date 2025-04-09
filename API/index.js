import Express from 'express'
import cors from 'cors'
import { DBPostgres } from './BDPostgres.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import senaindex from './Sena/Routes/Index_sena.js'
import 'dotenv/config'
import path from 'path'
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth
} from '@clerk/express'
import clerkwebhook from './Sena/Routes/ClerkWebhook.js'
import { error } from 'console'
import rutasuriel from './Uriel/Rurtasesp32.js'
const PORT = process.env.PORT
const DEPLOY = process.env.DEPLOY
const servidor = Express()

servidor.use(Express.json({ limit: '50mb' }))
servidor.use(Express.urlencoded({ extended: true, limit: '50mb' }))

servidor.use(morgan('dev'))
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
servidor.use(clerkMiddleware())
servidor.use(cors(corsOptions))

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/sena', senaindex)
servidor.use('/webhookclerk', clerkwebhook)

servidor.get('/uriel', (req, res) => {
  res.sendFile('./uriel.html', { root: '.' })
})
servidor.use('/uriel', rutasuriel)

servidor.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Consola</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <style>
      html, body { 
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      .invert:hover > img { 
        filter: invert(100%); 
      }
    </style>
  </head>
  <body class="bg-black flex items-center justify-center p-0 m-0 h-screen w-screen">
    <!-- Contenedor principal EXTRA GRANDE -->
    <div style="font-family: Segoe UI" class="w-[98vw] h-[96vh] mx-auto border-4 border-green-600">
      <div class="w-full h-full bg-black">
        <!-- Barra de título más grande -->
        <div class="flex justify-between bg-white border-b-2 border-gray-500 h-10">
          <div class="flex items-center">
            <span class="p-3">
              <img height="24px" width="24px" src="https://i.postimg.cc/bNnF0xB3/icon.png"/>
            </span>
            <p class="text-base ml-2">CONSOLA DE SERVIDOR</p>
          </div>
          <div class="flex">
            <span class="p-3 px-4 hover:bg-gray-300">
              <img height="16px" width="16px" src="https://i.postimg.cc/BtB4zdMC/min.png"/>
            </span>
            <span class="p-3 px-4 hover:bg-gray-300">
              <img height="16px" width="16px" src="https://i.postimg.cc/vDsG3QLB/max.png"/>
            </span>
            <span class="p-3 px-4 hover:bg-red-500 invert">
              <img height="16px" width="16px" src="https://i.postimg.cc/xNRxPGGK/close.png"/>
            </span>
          </div>
        </div>
        <!-- Contenido de la consola EXTRA GRANDE -->
        <div class="p-4 h-[calc(100%-40px)] text-white font-mono text-xl bg-black overflow-y-auto">
          <p class="pb-2">ApiGeneral [Versión 4]</p>
          <p class="pb-2">&nbsp;</p>
          <p class="pb-2">V:/Usuarios/Josmer></p>
                    <p class="pb-2" id="deploy">estado del servidor: activo

          <p class="pb-2" id="db">Conectado a base de datos: ${process.env.POSTGRES_DOCKER}</p>
          <p class="pb-2" id="deploy">Rutas activas: ${DEPLOY}</p>
        </div>
      </div>
    </div>
  </body>
</html>
  `)
})
servidor.get('*', (req, res) => {
  res.sendFile('./404.html', { root: '.' })
})

try {
  // await basedatospostgres.query('CREATE SCHEMA IF NOT EXISTS ecomerseuno;')
  await DBPostgres.query('CREATE SCHEMA IF NOT EXISTS sena;')
  await DBPostgres.query('CREATE SCHEMA IF NOT EXISTS uriel;')

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
