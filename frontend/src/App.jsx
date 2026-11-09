import { Navigate, Route, Routes } from 'react-router'

import DetalleSolicitud from './pages/DetalleSolicitud'
import ListaSolicitudes from './pages/ListaSolicitudes'
import RegistroSolicitud from './pages/RegistroSolicitud'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/solicitudes" replace />}
      />

      <Route
        path="/solicitudes"
        element={<ListaSolicitudes />}
      />

      <Route
        path="/solicitudes/nueva"
        element={<RegistroSolicitud />}
      />

      <Route
        path="/solicitudes/:codigo"
        element={<DetalleSolicitud />}
      />
    </Routes>
  )
}

export default App