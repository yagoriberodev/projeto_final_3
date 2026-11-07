import { Routes, Route } from 'react-router-dom'
import Layout from './componentes/Layout'
import RotaProtegida from './componentes/RotaProtegida'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Usuario from './pages/Usuario'
import Times from './pages/Times'
import Admin from './pages/Admin'

// O App.jsx só define as rotas do projeto.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />

        {/* Páginas para quem está logado */}
        <Route element={<RotaProtegida />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/times" element={<Times />} />
        </Route>

        {/* Página só do administrador */}
        <Route element={<RotaProtegida tipos={['Administrador']} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
