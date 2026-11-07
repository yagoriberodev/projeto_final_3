import { useOutletContext } from 'react-router-dom'
import Botao from '../componentes/Botao'
import logo from '../assets/laivy.jpg'
import '../styles/Inicio.css'

function Inicio() {
  // O usuário logado vem da RotaProtegida (que perguntou ao backend).
  const usuario = useOutletContext()
  const destino = usuario.tipo === 'Administrador' ? '/admin' : '/usuario'

  return (
    <main className="inicio">
      <img className="inicio__logo" src={logo} alt="Logo do LAIVY" />
      <Botao to={destino}>Entrar</Botao>
    </main>
  )
}

export default Inicio
