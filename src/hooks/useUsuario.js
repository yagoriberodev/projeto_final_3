import { useEffect, useState } from 'react'
import { buscarDashboardCliente } from '../services/dashboardService'

// Busca no backend os dados do dashboard do cliente.
function useUsuario() {
  const [dashboard, setDashboard] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarDashboardCliente()
      .then(setDashboard)
      .catch((e) => setErro(e.message))
  }, [])

  return { dashboard, erro }
}

export default useUsuario
