import { requisicao } from './api'

// Nada é guardado no armazenamento do navegador: o token fica só no cookie httpOnly.
// Quem sabe se há alguém logado é o backend, pelo cookie.

// Login: o backend confere a senha e coloca o token no cookie.
export async function login(loginDigitado, senha) {
  if (!loginDigitado.trim() || !senha.trim()) {
    throw new Error('Preencha o login e a senha.')
  }

  return requisicao('/api/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ login: loginDigitado.trim(), senha }),
  })
}

// Pergunta ao backend quem está logado. Devolve null se ninguém estiver.
export async function buscarSessao() {
  try {
    return await requisicao('/api/me')
  } catch (erro) {
    if (erro.status === 401) return null
    throw erro
  }
}

// Sair: o backend apaga o cookie.
export function logout() {
  return requisicao('/api/logout', { method: 'POST' })
}
