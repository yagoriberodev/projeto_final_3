import { useEffect, useState } from 'react'
import { buscarSessao } from '../services/authService'

// Descobre quem está logado perguntando ao backend (GET /api/me).
function useSessao() {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarSessao()
      .then(setUsuario)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  return { usuario, carregando, erro }
}

export default useSessao
