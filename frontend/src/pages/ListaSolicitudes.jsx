import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router'

import {
  descargarSolicitudes,
  listarSolicitudes,
} from '../services/solicitudApi'

const FILTROS_INICIALES = {
  fecha: '',
  tipoSolicitud: '',
}

const ORDEN_INICIAL = {
  ordenarPor: 'codigo',
  direccion: 'asc',
}

function ListaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [consulta, setConsulta] = useState({
    ...FILTROS_INICIALES,
    ...ORDEN_INICIAL,
  })
  const [solicitudAbierta, setSolicitudAbierta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activa = true

    listarSolicitudes(consulta)
      .then((datos) => {
        if (activa) {
          setSolicitudes(datos)
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
  }, [consulta])

  function iniciarConsulta(nuevaConsulta) {
    setCargando(true)
    setError('')
    setSolicitudAbierta(null)
    setConsulta(nuevaConsulta)
  }

  function actualizarFiltro(evento) {
    const { name, value } = evento.target

    setFiltros((actuales) => ({
      ...actuales,
      [name]: value,
    }))
  }

  function buscar(evento) {
    evento.preventDefault()

    iniciarConsulta({
      ...consulta,
      ...filtros,
    })
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES)

    iniciarConsulta({
      ...FILTROS_INICIALES,
      ...ORDEN_INICIAL,
    })
  }

  function ordenarPor(campo) {
    const nuevaDireccion =
      consulta.ordenarPor === campo && consulta.direccion === 'asc'
        ? 'desc'
        : 'asc'

    iniciarConsulta({
      ...consulta,
      ordenarPor: campo,
      direccion: nuevaDireccion,
    })
  }

  function indicadorOrden(campo) {
    if (consulta.ordenarPor !== campo) {
      return ''
    }

    return consulta.direccion === 'asc' ? ' ▲' : ' ▼'
  }

  function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-')
    return `${dia}/${mes}/${anio}`
  }

  function alternarContactos(codigo) {
    setSolicitudAbierta((actual) =>
      actual === codigo ? null : codigo,
    )
  }

  async function exportar() {
    try {
      setError('')
      await descargarSolicitudes(consulta)
    } catch (problema) {
      setError(problema.message)
    }
  }

  return (
    <main>
      <header>
        <div className="title-group">
          <span className="page-icon" aria-hidden="true">≣</span>

          <div>
            <h1>Solicitudes</h1>
            <p>Consulta y gestiona las solicitudes registradas</p>
          </div>
        </div>

        <Link to="/solicitudes/nueva">
          <span aria-hidden="true">＋</span>
          Nueva solicitud
        </Link>
      </header>

      <section className="filter-card">
        <h2>Filtros de búsqueda</h2>

        <form className="filters-grid" onSubmit={buscar}>
          <label>
            Fecha de envío
            <input
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={actualizarFiltro}
            />
          </label>

          <label>
            Tipo de solicitud
            <input
              type="text"
              name="tipoSolicitud"
              value={filtros.tipoSolicitud}
              onChange={actualizarFiltro}
              placeholder="Todos los tipos"
            />
          </label>

          <button
            className="button-secondary"
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>

          <button type="submit">
            Buscar
          </button>
        </form>
      </section>

      <section className="table-card">
        <div className="table-card-header">
          <div>
            <h2>Solicitudes registradas</h2>
            <p>
              {solicitudes.length}{' '}
              {solicitudes.length === 1
                ? 'registro encontrado'
                : 'registros encontrados'}
            </p>
          </div>

          <button
            className="button-secondary"
            type="button"
            onClick={exportar}
          >
            Exportar CSV
          </button>
        </div>

        {error && <p role="alert">{error}</p>}

        {cargando ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>No se encontraron solicitudes</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('codigo')}
                    >
                      Código{indicadorOrden('codigo')}
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('marca')}
                    >
                      Marca{indicadorOrden('marca')}
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('tipoSolicitud')}
                    >
                      Tipo{indicadorOrden('tipoSolicitud')}
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('fechaEnvio')}
                    >
                      Fecha{indicadorOrden('fechaEnvio')}
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('numeroContacto')}
                    >
                      Número{indicadorOrden('numeroContacto')}
                    </button>
                  </th>

                  <th>
                    <button
                      type="button"
                      onClick={() => ordenarPor('nombreContacto')}
                    >
                      Contacto principal
                      {indicadorOrden('nombreContacto')}
                    </button>
                  </th>

                  <th>Contactos adicionales</th>
                </tr>
              </thead>

              <tbody>
                {solicitudes.map((solicitud) => (
                  <Fragment key={solicitud.codigo}>
                    <tr>
                      <td>
                        <Link to={`/solicitudes/${solicitud.codigo}`}>
                          {solicitud.codigo}
                        </Link>
                      </td>

                      <td>{solicitud.marca}</td>

                      <td>
                        <span
                          className={
                            solicitud.tipoSolicitud.toLowerCase() ===
                            'reclamo'
                              ? 'type-badge type-badge-red'
                              : 'type-badge type-badge-blue'
                          }
                        >
                          {solicitud.tipoSolicitud}
                        </span>
                      </td>

                      <td>{formatearFecha(solicitud.fechaEnvio)}</td>
                      <td>{solicitud.numeroContacto}</td>
                      <td>{solicitud.nombreContacto}</td>

                      <td>
                        {solicitud.contactos.length === 0 ? (
                          <span className="contact-badge contact-badge-empty">
                            Sin contactos
                          </span>
                        ) : (
                          <button
                            className="contact-badge"
                            type="button"
                            aria-expanded={
                              solicitudAbierta === solicitud.codigo
                            }
                            onClick={() =>
                              alternarContactos(solicitud.codigo)
                            }
                          >
                            {solicitud.contactos.length}{' '}
                            {solicitud.contactos.length === 1
                              ? 'contacto'
                              : 'contactos'}
                          </button>
                        )}
                      </td>
                    </tr>

                    {solicitudAbierta === solicitud.codigo && (
                      <tr className="contacts-row">
                        <td colSpan="7">
                          <div className="contacts-list">
                            {solicitud.contactos.map((contacto) => (
                              <div
                                className="contact-item"
                                key={contacto.identificador}
                              >
                                <strong>{contacto.nombreContacto}</strong>
                                <span>{contacto.numeroContacto}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default ListaSolicitudes