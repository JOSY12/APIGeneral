import Express from 'express'
import cors from 'cors'
import { DBPostgres } from './BDPostgres.js'
import morgan from 'morgan'
import fastcheckout from './Fastcheckout/routes/fastcheckout.js'
import senaindex from './Sena/Routes/Index_sena.js'
import 'dotenv/config'
import rutasuriel from './Uriel/Rurtasesp32.js'
import stripewebhook from './Sena/Routes/StripeWebhook.js'
const PORT = process.env.PORT
const DEPLOY = process.env.DEPLOY
const servidor = Express()

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
servidor.use(cors(corsOptions))
// servidor.use(Express.static('public'))

servidor.use(
  '/sena/stripe',
  Express.raw({ type: 'application/json' }),
  stripewebhook
)
// webhook para stripe express raw recibe formato raw y no json luego se convierte a json
servidor.use(Express.json({ limit: '50mb' }))

servidor.use('/fastcheckout', fastcheckout)
servidor.use('/sena', senaindex)
servidor.get('/uriel', (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test de Proyectos uriel</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  </head>
  <body class="bg-black">
    <!-- comienza el agregar -->
<div class="relative">
  <!-- Botón para abrir el modal -->
  <button class="z-20 cursor-pointer text-white flex flex-col shrink-0 grow-0 justify-around 
                  fixed bottom-0 right-0 right-5 rounded-lg
                  mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10" onclick="openModal()">
    <div class="p-3 rounded-full border-4 border-white bg-green-600">
      <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5"></circle>
          <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
        </g>
      </svg>
    </div>
  </button>

  <!-- Modal -->
  <div id="myModal" class="fixed inset-0 bg-black  flex justify-center items-center hidden">
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="text-2xl  text-center   mb-4">Agregar GPIO de esp32</h2>
      <form id="modalForm" onsubmit="submitForm(event)">
        <div class="mb-4">
          <label for="gpio" class="block text-xl font-medium text-gray-700">GPIO:</label>
          <input type="number" max=30 min=1 id="gpio" name="gpio" class="mt-1 block w-full border-gray-300 rounded-md" required>
        </div>

        <div class="mb-4">
          <label for="encendido" class="block text-xl font-medium text-gray-700">Encendido:</label>
          <input type="number" max=1 min=0 id="encendido" name="encendido" class="mt-1 block w-full border-gray-300 rounded-md" required>
        </div>
    <span id="spanerror" class="bg-black text-red-500 text-2xl" > </span>
        <button type="submit" class="mt-4 bg-green-500 text-white p-2 rounded-lg w-full">Guardar</button>
      </form>
      <button onclick="closeModal()" class="mt-4 bg-red-500 text-white p-2 rounded-lg w-full">Cerrar</button>
    </div>
  </div>
</div>

 


    <!-- termina el agregar -->
    <div class="container mx-auto">
      <!--titulo -->
      <h1 class="text-4xl flex justify-center mt-10 text-white font-bold mb-4">
        Test botones Wifi
      </h1>
      <h1
        id="cargando"
        class="text-4xl flex justify-center mt-10 text-white font-bold mb-4"
      ></h1>
      <!-- contenedor general de botones -->
      <div
        id="contenedorbotones"
        class="bg-black rounded-2xl grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-white"
      ></div>
    </div>
  </body>

<script src="/uriel.js"></script>

</html>
`)
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
  // await DBPostgres.query('CREATE SCHEMA IF NOT EXISTS uriel;')

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
