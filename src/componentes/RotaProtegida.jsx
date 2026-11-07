import { Navigate, Outlet } from 'react-router-dom'
import useSessao from '../hooks/useSessao'

// Protege as páginas: confere no backend se há alguém logado.
// "tipos" (opcional) limita a rota a alguns tipos de usuário, ex.: ['Administrador'].
// As páginas de dentro pegam o usuário com useOutletContext().
function RotaProtegida({ tipos }) {
  const { usuario, carregando, erro } = useSessao()

  if (carregando) {
    return <p className="mensagem-pagina">Carregando...</p>
  }

  if (erro) {
    return <p className="mensagem-pagina mensagem-pagina--erro" role="alert">{erro}</p>
  }

  // Ninguém logado: volta para o login.
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // Tipo de usuário sem permissão para esta página.
  if (tipos && !tipos.includes(usuario.tipo)) {
    return <Navigate to="/usuario" replace />
  }

  return <Outlet context={usuario} />
}

export default RotaProtegida
