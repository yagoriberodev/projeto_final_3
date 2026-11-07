import { useNavigate } from 'react-router-dom'
import Botao from './Botao'
import { logout } from '../services/authService'

// Botão "Sair": pede ao backend para apagar o cookie e volta ao login.
function BotaoSair() {
  const navigate = useNavigate()

  async function sair() {
    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  return (
    <Botao variante="secundario" onClick={sair}>
      Sair
    </Botao>
  )
}

export default BotaoSair
