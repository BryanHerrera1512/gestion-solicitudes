import { useState } from 'react'
import { es } from 'date-fns/locale/es'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Link, useNavigate } from 'react-router'

import 'react-datepicker/dist/react-datepicker.css'

import { registrarSolicitud } from '../services/solicitudApi'

registerLocale('es', es)

const SOLICITUD_INICIAL = {
  marca: '',
  tipoSolicitud: '',
  fechaEnvio: '',
  numeroContacto: '',
  nombreContacto: '',
  contactos: [],
}

function RegistroSolicitud() {
  const navigate = useNavigate()

  const [solicitud, setSolicitud] = useState(SOLICITUD_INICIAL)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function actualizarCampo(evento) {
    const { name, value } = evento.target

    setSolicitud((actual) => ({
      ...actual,
      [name]:
        name === 'numeroContacto'
          ? value.replace(/\D/g, '')
          : value,
    }))
  }

  function actualizarFecha(fecha) {
    if (!fecha) {
      setSolicitud((actual) => ({
        ...actual,
        fechaEnvio: '',
      }))
      return
    }

    // Evita que una fecha incompleta rompa la pantalla
    if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
      return
    }

    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')

    setSolicitud((actual) => ({
      ...actual,
      fechaEnvio: `${anio}-${mes}-${dia}`,
    }))
  }

  function agregarContacto() {
    setSolicitud((actual) => ({
      ...actual,
      contactos: [
        ...actual.contactos,
        {
          nombreContacto: '',
          numeroContacto: '',
        },
      ],
    }))
  }

  function actualizarContacto(indice, campo, valor) {
    setSolicitud((actual) => ({
      ...actual,
      contactos: actual.contactos.map((contacto, posicion) => {
        if (posicion !== indice) {
          return contacto
        }

        return {
          ...contacto,
          [campo]:
            campo === 'numeroContacto'
              ? valor.replace(/\D/g, '')
              : valor,
        }
      }),
    }))
  }

  function eliminarContacto(indice) {
    setSolicitud((actual) => ({
      ...actual,
      contactos: actual.contactos.filter(
        (_, posicion) => posicion !== indice,
      ),
    }))
  }

  async function guardar(evento) {
    evento.preventDefault()

    if (!solicitud.fechaEnvio) {
      setError('La fecha de envio es obligatoria')
      return
    }

    setGuardando(true)
    setError('')

    try {
      const registrada = await registrarSolicitud(solicitud)

      navigate(`/solicitudes/${registrada.codigo}`, {
        state: {
          mensaje: 'Solicitud registrada correctamente',
        },
      })
    } catch (problema) {
      setError(problema.message)
    } finally {
      setGuardando(false)
    }
  }

  const fechaSeleccionada =
    /^\d{4}-\d{2}-\d{2}$/.test(solicitud.fechaEnvio)
      ? new Date(`${solicitud.fechaEnvio}T00:00:00`)
      : null

  return (
    <main>
      <header>
        <div>
          <h1>Registro de solicitud</h1>
          <p>Completa los datos de la solicitud y sus contactos</p>
        </div>

        <Link to="/solicitudes">
          Volver al listado
        </Link>
      </header>

      <form onSubmit={guardar}>
        <section>
          <h2>Datos de la solicitud</h2>

          <label>
            Marca
            <input
              type="text"
              name="marca"
              value={solicitud.marca}
              onChange={actualizarCampo}
              maxLength="100"
              required
            />
          </label>

          <label>
            Tipo de solicitud
            <input
              type="text"
              name="tipoSolicitud"
              value={solicitud.tipoSolicitud}
              onChange={actualizarCampo}
              maxLength="100"
              required
            />
          </label>

          <label>
            Fecha de envío
            <DatePicker
              selected={fechaSeleccionada}
              onChange={actualizarFecha}
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText="dd/mm/aaaa"
              calendarStartDay={1}
              strictParsing
              isClearable
              showPopperArrow={false}
              wrapperClassName="date-picker-wrapper"
            />
          </label>

          <label>
            Nombre de contacto
            <input
              type="text"
              name="nombreContacto"
              value={solicitud.nombreContacto}
              onChange={actualizarCampo}
              maxLength="150"
              required
            />
          </label>

          <label>
            Número de contacto
            <input
              type="text"
              name="numeroContacto"
              value={solicitud.numeroContacto}
              onChange={actualizarCampo}
              inputMode="numeric"
              maxLength="20"
              required
            />
          </label>
        </section>

        <section>
          <div>
            <h2>Contactos adicionales</h2>

            <button type="button" onClick={agregarContacto}>
              Agregar contacto
            </button>
          </div>

          {solicitud.contactos.length === 0 ? (
            <p>No se agregaron contactos adicionales</p>
          ) : (
            solicitud.contactos.map((contacto, indice) => (
              <fieldset key={indice}>
                <legend>Contacto {indice + 1}</legend>

                <label>
                  Nombre de contacto
                  <input
                    type="text"
                    value={contacto.nombreContacto}
                    onChange={(evento) =>
                      actualizarContacto(
                        indice,
                        'nombreContacto',
                        evento.target.value,
                      )
                    }
                    maxLength="150"
                    required
                  />
                </label>

                <label>
                  Número de contacto
                  <input
                    type="text"
                    value={contacto.numeroContacto}
                    onChange={(evento) =>
                      actualizarContacto(
                        indice,
                        'numeroContacto',
                        evento.target.value,
                      )
                    }
                    inputMode="numeric"
                    maxLength="20"
                    required
                  />
                </label>

                <button
                  type="button"
                  onClick={() => eliminarContacto(indice)}
                >
                  Quitar contacto
                </button>
              </fieldset>
            ))
          )}
        </section>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Registrar solicitud'}
        </button>
      </form>
    </main>
  )
}

export default RegistroSolicitud