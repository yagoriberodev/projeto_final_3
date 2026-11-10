import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, loginComGoogle } from '../services/authService'

// Guarda o que a pessoa digitou e faz o login ao enviar o formulário.
function useLogin() {
  const [loginDigitado, setLoginDigitado] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregandoGoogle, setCarregandoGoogle] = useState(false)
  const navigate = useNavigate()

  async function entrar(evento) {
    evento.preventDefault()
    setErro('')
    try {
      await login(loginDigitado, senha)
      navigate('/inicio')
    } catch (e) {
      setErro(e.message)
    }
  }

  async function entrarComGoogle() {
    setErro('')
    setCarregandoGoogle(true)
    try {
      await loginComGoogle()
      navigate('/inicio')
    } catch (e) {
      const mensagens = {
        'auth/popup-closed-by-user': 'A janela de login foi fechada antes de concluir.',
        'auth/popup-blocked': 'Permita pop-ups para entrar com o Google.',
        'auth/unauthorized-domain': 'Este endereço não está autorizado no Firebase Authentication.',
      }
      setErro(mensagens[e.code] || e.message)
    } finally {
      setCarregandoGoogle(false)
    }
  }

  return { loginDigitado, setLoginDigitado, senha, setSenha, erro, entrar, entrarComGoogle, carregandoGoogle }
}

export default useLogin
