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

// servidor.use(Express.static('public'))
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
        html, body { height: 100%; margin: 0; }
        .invert:hover > img { filter: invert(100%); }
      </style>
    </head>
    <body class="bg-black flex items-center m-5 justify-center h-full">
      <div style="font-family: Segoe UI" class="w-full max-w-4xl mx-auto border border-red-600">
        <div class="w-full subpixel-antialiased h-full bg-black border-black">
          <div class="flex justify-between bg-white border-b border-gray-500">
            <div class="flex">
              <span style="padding: 7px"><img height="13px" width="16px" src="https://i.postimg.cc/bNnF0xB3/icon.png"/></span>
              <p class="text-xs" style="padding-top: 4px">Consola de servidor</p>
            </div>
            <div class="flex">
              <span class="p-2 px-3 hover:bg-gray-300"><img height="10px" width="10px" src="https://i.postimg.cc/BtB4zdMC/min.png"/></span>
              <span class="p-2 px-3 hover:bg-gray-300"><img height="10px" width="10px" src="https://i.postimg.cc/vDsG3QLB/max.png"/></span>
              <span class="p-2 px-3 hover:bg-red-500 invert"><img height="10px" width="10px" src="https://i.postimg.cc/xNRxPGGK/close.png"/></span>
            </div>
          </div>
          <div class="pl-1 pt-1 h-full text-white font-mono text-xs bg-black">
            <p class="pb-1">ApiGeneral [Versión 4]</p>
            <p class="pb-1">&nbsp;</p>
            <p class="pb-1">V:\\Usuarios\\Josmer></p>
            <p class="pb-1" id="db">Conectado a base de datos: ${process.env.POSTGRES_DOCKER}</p>
            <p class="pb-1" id="deploy">Rutas activas: ${DEPLOY}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
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
