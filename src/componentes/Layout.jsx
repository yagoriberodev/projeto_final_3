import { Outlet } from 'react-router-dom'
import Footer from './Footer'

// Estrutura repetida em todas as páginas: a página da rota + o rodapé.
function Layout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout
