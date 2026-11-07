import { requisicao } from './api'

// Dados do dashboard do cliente (só do usuário logado).
export function buscarDashboardCliente() {
  return requisicao('/api/dashboard/cliente')
}

// Dados do dashboard do administrador (o sistema inteiro).
export function buscarDashboardAdmin() {
  return requisicao('/api/dashboard/admin')
}
