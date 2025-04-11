const actualizardatos = async ({ id, encendido, blink }) => {
  try {
    await axios.put('/uriel/actualizar', { id, encendido, blink })
    api()
  } catch (error) {
    console.error('Error en la petición:', error)
  }
}
async function handleSelect(selectElement, id) {
  let encendido = Number(selectElement.dataset.encendido)
  let blink = Number(selectElement.dataset.blink)

  const tipo = selectElement.value

  if (tipo === 'encendido') {
    encendido = encendido === 1 ? 0 : 1
    selectElement.dataset.encendido = encendido
  } else if (tipo === 'blink') {
    blink = blink === 1 ? 0 : 1
    selectElement.dataset.blink = blink
  }

  actualizardatos({ id, encendido, blink })

  // 🔁 Restablecer el select para que puedas seleccionar de nuevo la misma opción
  selectElement.selectedIndex = 0
}

const borrarpin = async (id) => {
  const borrado = await axios.delete(`/uriel/borrarpin/${id}`)
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
  <div class="p-4 grid">
  <div class="grid grid-cols-3 ">
 
   <span class="text-xl text-center bg-green-600 rounded-tl-2xl col-span-2 font-medium">GPIO ${
     e.id
   }</span>

    <button onclick="borrarpin(${
      e.id
    })" class="bg-red-500 rounded-tr-2xl cursor-pointer text-2xl">
      Borrar
    </button>
     <select class="p=2 bg-purple-500  rounded col-span-3  text-white" "
  onchange="handleSelect(this, ${e.id})"
  data-encendido="${e.encendido}"
  data-blink="${e.blink}"
  class="p-2 rounded col-span-2"
>
    
  <option disabled selected>Seleccionar acción</option>
  <option value="encendido">Encender/Apagar</option>
  <option value="blink">${
    e.blink === 1 ? 'parpadeo/apagar' : 'parpadeo/encender'
  }</option>
</select>
  </div>

  <p class="bg-blue-600 text-center rounded-bl-2xl rounded-br-2xl text-lg ">
    GPIO ${e.id} - Encendido: ${e.encendido} | Blink: ${e.blink}
  </p>
</div>
    `
      })
      .join('')
  } catch (error) {
    return 'Error al hacer fetch:', error
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
  await agregarpin(gpio, encendido)
  api()
  // Puedes cerrar el modal después de enviar los datos
  if (!span.innerText.length) {
    closeModal()
  }
}
