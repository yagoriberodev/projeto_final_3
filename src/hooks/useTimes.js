import { useEffect, useState } from 'react'
import { listarTimes, criarTime, excluirTime } from '../services/timesService'

const FORM_VAZIO = { nome: '', modalidade: '', categoria: '', atletas: '' }

// Cuida da lista de times, do formulário de cadastro e da exclusão.
function useTimes() {
  const [times, setTimes] = useState([])
  const [form, setForm] = useState(FORM_VAZIO)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarTimes()
      .then(setTimes)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  function atualizarCampo(nome, valor) {
    setForm((atual) => ({ ...atual, [nome]: valor }))
  }

  async function cadastrar(evento) {
    evento.preventDefault()
    setErro('')
    try {
      const novo = await criarTime(form)
      setTimes((atual) => [...atual, novo])
      setForm(FORM_VAZIO)
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(id) {
    setErro('')
    try {
      await excluirTime(id)
      setTimes((atual) => atual.filter((t) => t.id !== id))
    } catch (e) {
      setErro(e.message)
    }
  }

  return { times, form, erro, carregando, atualizarCampo, cadastrar, excluir }
}

export default useTimes
