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

const api = async () => {
  try {
    const datos = await axios.get('/uriel/datos')

    const contenedor = document.getElementById('contenedorbotones')
    const cargando = document.getElementById('cargando')

    if (!datos.data.length) cargando.innerText = 'no hay contenido que mostrar'
    if (datos.data.length) cargando.innerText = ''
    contenedor.innerHTML = datos.data
      .map((e, k) => {
        return `
      <div class="p-4">
        <button 
          class= "${
            e.encendido === 1 ? 'bg-green-500' : 'bg-red-600'
          }  cursor-pointer p-4 rounded-lg text-center w-full" 
          onclick="actualizardatos({ encendido: '${
            e.encendido === 1 ? 0 : 1
          }', id: '${e.id}' })"
        >
          <span class="text-xl text-center font-medium">LED ${e.id}</span>
        </button>
        <p id="btn1estado" class="text-lg text-center mt-2">
        LED.Estado: ${e.encendido}  ${
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

const agregarled = async () => {
  const crear = await axios.post()
}
