import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'

import { obtenerSolicitud } from '../services/solicitudApi'

function DetalleSolicitud() {
  const { codigo } = useParams()
  const location = useLocation()

  const [solicitud, setSolicitud] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activa = true

    obtenerSolicitud(codigo)
      .then((datos) => {
        if (activa) {
          setSolicitud(datos)
        }
      })
      .catch((problema) => {
        if (activa) {
          setError(problema.message)
        }
      })
      .finally(() => {
        if (activa) {
          setCargando(false)
        }
      })

    return () => {
      activa = false
    }
  }, [codigo])

  if (cargando) {
    return (
      <main>
        <p>Cargando solicitud...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>No se pudo consultar la solicitud</h1>
        <p role="alert">{error}</p>
        <Link to="/solicitudes">Volver al listado</Link>
      </main>
    )
  }

  return (
    <main>
      <header>
        <div>
          <h1>Información de la solicitud</h1>
          <p>Código {solicitud.codigo}</p>
        </div>

        <Link to="/solicitudes">
          Volver al listado
        </Link>
      </header>

      {location.state?.mensaje && (
        <p className="success-message" role="status">
          {location.state.mensaje}
        </p>
      )}

      <section>
        <h2>Datos registrados</h2>

        <dl>
          <div>
            <dt>Marca</dt>
            <dd>{solicitud.marca}</dd>
          </div>

          <div>
            <dt>Tipo de solicitud</dt>
            <dd>{solicitud.tipoSolicitud}</dd>
          </div>

          <div>
            <dt>Fecha de envío</dt>
            <dd>{solicitud.fechaEnvio}</dd>
          </div>

          <div>
            <dt>Nombre de contacto</dt>
            <dd>{solicitud.nombreContacto}</dd>
          </div>

          <div>
            <dt>Número de contacto</dt>
            <dd>{solicitud.numeroContacto}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Contactos adicionales</h2>

        {solicitud.contactos.length === 0 ? (
          <p>No se registraron contactos adicionales</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Identificador</th>
                  <th>Nombre</th>
                  <th>Número</th>
                </tr>
              </thead>

              <tbody>
                {solicitud.contactos.map((contacto) => (
                  <tr key={contacto.identificador}>
                    <td>{contacto.identificador}</td>
                    <td>{contacto.nombreContacto}</td>
                    <td>{contacto.numeroContacto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default DetalleSolicitud