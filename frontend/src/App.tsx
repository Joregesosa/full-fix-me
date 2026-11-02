import { Navigate, Route, Routes } from 'react-router'
import RutaProtegida from './components/RutaProtegida'
import Layout from './components/Layout'
import PaginaLogin from './pages/PaginaLogin'
import PaginaCatalogo from './pages/PaginaCatalogo'
import PaginaDetalleLibro from './pages/PaginaDetalleLibro'
import PaginaMisPrestamos from './pages/PaginaMisPrestamos'
import PaginaSinAcceso from './pages/PaginaSinAcceso'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaCatalogo />} />
          <Route path="/libros/:id" element={<PaginaDetalleLibro />} />
          <Route element={<RutaProtegida rolesPermitidos={['MIEMBRO']} />}>
            <Route path="/prestamos" element={<PaginaMisPrestamos />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
