import { useEffect, useState } from 'react'
import { buscarDashboardAdmin } from '../services/dashboardService'
import { excluirTime } from '../services/timesService'

// Busca os dados do dashboard do administrador e permite excluir times.
function useAdmin() {
  const [dashboard, setDashboard] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarDashboardAdmin()
      .then(setDashboard)
      .catch((e) => setErro(e.message))
  }, [])

  async function excluir(time) {
    if (!window.confirm(`Excluir o time "${time.nome}"?`)) return

    setErro('')
    try {
      await excluirTime(time.id)
      setDashboard(await buscarDashboardAdmin()) // atualiza os números e as tabelas
    } catch (e) {
      setErro(e.message)
    }
  }

  return { dashboard, erro, excluir }
}

export default useAdmin
