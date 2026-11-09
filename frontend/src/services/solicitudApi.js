const API_URL = '/api/solicitudes'

function construirUrl(ruta, parametros = {}) {
  const consulta = new URLSearchParams()

  Object.entries(parametros).forEach(([nombre, valor]) => {
    if (valor !== '' && valor !== null && valor !== undefined) {
      consulta.append(nombre, valor)
    }
  })

  const query = consulta.toString()
  return query ? `${ruta}?${query}` : ruta
}

async function obtenerMensajeError(response) {
  try {
    const datos = await response.json()

    if (datos.mensaje) {
      return datos.mensaje
    }

    const mensajes = Object.values(datos)

    if (mensajes.length > 0) {
      return mensajes.join('. ')
    }
  } catch {
    return 'No se pudo completar la solicitud'
  }

  return 'No se pudo completar la solicitud'
}

async function validarRespuesta(response) {
  if (!response.ok) {
    const mensaje = await obtenerMensajeError(response)
    throw new Error(mensaje)
  }

  return response
}

export async function listarSolicitudes(filtros) {
  const url = construirUrl(API_URL, filtros)
  const response = await fetch(url)

  await validarRespuesta(response)
  return response.json()
}

export async function obtenerSolicitud(codigo) {
  const response = await fetch(`${API_URL}/${codigo}`)

  await validarRespuesta(response)
  return response.json()
}

export async function registrarSolicitud(solicitud) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(solicitud),
  })

  await validarRespuesta(response)
  return response.json()
}

export async function descargarSolicitudes(filtros) {
  const url = construirUrl(`${API_URL}/exportar`, filtros)
  const response = await fetch(url)

  await validarRespuesta(response)

  const archivo = await response.blob()
  const enlace = document.createElement('a')
  const direccion = URL.createObjectURL(archivo)

  enlace.href = direccion
  enlace.download = 'solicitudes.csv'
  enlace.click()

  URL.revokeObjectURL(direccion)
}