const actualizardatos = async ({ encendido, id }) => {
  try {
    const enviarpeticion = await axios.put('/uriel/actualizar', {
      encendido,
      id
    })
  } catch (error) {
    console.error('Error en la petición:', error)
  }
  api()
}
const borrarpin = async (id) => {
  const borrado = await axios.delete(`/uriel/borrarpin/${id}`)
  console.log(borrado)
  api()
}
const api = async () => {
  try {
    const datos = await axios.get('/uriel/datos')

    const contenedor = document.getElementById('contenedorbotones')
    const cargando = document.getElementById('cargando')

    if (!datos.data.length) cargando.innerText = 'sin datos que mostrar'
    if (datos.data.length) cargando.innerText = ''
    contenedor.innerHTML = datos.data
      .map((e, k) => {
        return `
      <div class="p-4 grid ">

      <div class="grid grid-cols-3 ":> 

        <button 
          class= "${
            e.encendido === 1 ? 'bg-green-500' : 'bg-red-600'
          }  cursor-pointer p-4 rounded-tl-2xl   text-center col-span-2 w-full" 
          onclick="actualizardatos({ encendido: '${
            e.encendido === 1 ? 0 : 1
          }', id: '${e.id}' })"
        >
          <span class="text-xl text-center font-medium">GPIO ${e.id}</span>
        </button>
         <button  onclick="borrarpin(${
           e.id
         })" class="bg-red-500 rounded-tr-2xl  cursor-pointer text-2xl "> Borrar</button>
        </div>
        <p class="bg-blue-600 text-center rounded-bl-2xl rounded-br-2xl" id="btn1estado" class="text-lg text-center mt-2">
        GPIO.Estado: ${e.encendido}  ${
          e.encendido === 1 ? 'encendido' : 'apagado'
        }
        </p>
      </div>
    `
      })
      .join('')
  } catch (error) {
    console.error('Error al hacer fetch:', error)
  }
}
api()

const span = document.getElementById('spanerror')
const agregarpin = async (id, encendido) => {
  const creado = await axios.post('/uriel/agregarpin', { id, encendido })

  if (creado.data.error) {
    span.innerText = creado.data.error
  } else {
    span.innerText = ''
  }
}

function closeModal() {
  document.getElementById('myModal').classList.add('hidden')
}
// Función para abrir el modal
function openModal() {
  document.getElementById('myModal').classList.remove('hidden')
}

// Función para cerrar el modal

// Función para manejar el envío del formulario
async function submitForm(event) {
  event.preventDefault() // Evita que se recargue la página

  // Obtener los valores de los campos
  const gpio = document.getElementById('gpio').value
  const encendido = document.getElementById('encendido').value

  // Aquí puedes enviar estos valores a una API, o hacer algo con ellos
  const resultado = await agregarpin(gpio, encendido)
  api()
  // Puedes cerrar el modal después de enviar los datos
  if (!span.innerText.length) {
    closeModal()
  }
}
