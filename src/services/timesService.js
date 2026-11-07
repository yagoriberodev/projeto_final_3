import { requisicao } from './api'

export function listarTimes() {
  return requisicao('/api/times')
}

export function criarTime(time) {
  return requisicao('/api/times', { method: 'POST', body: JSON.stringify(time) })
}

export function excluirTime(id) {
  return requisicao(`/api/times/${id}`, { method: 'DELETE' })
}
