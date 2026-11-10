// Função única para falar com o backend (usada por todos os services).
// O navegador envia o cookie com o token sozinho: aqui não há token nenhum.

// Nestas duas rotas, um 401 é esperado (senha errada / ninguém logado).
const SEM_REDIRECIONAR = ['/api/usuarios/login', '/api/usuarios/login/google', '/api/me']

export async function requisicao(url, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...opcoes,
    })
  } catch {
    throw new Error('Não foi possível falar com o servidor. Ele está rodando?')
  }

  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null)

  if (!resposta.ok) {
    // Sessão vencida: volta para a tela de login.
    if (resposta.status === 401 && !SEM_REDIRECIONAR.includes(url)) {
      window.location.href = '/'
    }
    const erro = new Error(dados?.mensagem || 'Não foi possível falar com o servidor. Ele está rodando?')
    erro.status = resposta.status
    throw erro
  }
  return dados
}
