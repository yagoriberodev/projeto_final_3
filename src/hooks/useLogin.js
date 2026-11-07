import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

// Guarda o que a pessoa digitou e faz o login ao enviar o formulário.
function useLogin() {
  const [loginDigitado, setLoginDigitado] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
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

  return { loginDigitado, setLoginDigitado, senha, setSenha, erro, entrar }
}

export default useLogin
