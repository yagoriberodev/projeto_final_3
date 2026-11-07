// Tudo sobre login e proteção de rotas fica aqui.
//
// COMO O LOGIN FUNCIONA:
// 1. O usuário manda login e senha.
// 2. Se estiverem certos, o servidor cria um TOKEN (JWT) e o guarda num COOKIE "httpOnly".
// 3. Cookie httpOnly = o JavaScript do navegador NÃO consegue ler. Só o navegador
//    o envia sozinho a cada pedido. Por isso o token nunca fica guardado no armazenamento do navegador.
import jwt from 'jsonwebtoken'

// Em produção, defina a variável de ambiente JWT_SEGREDO com um texto longo e secreto.
const SEGREDO = process.env.JWT_SEGREDO || 'segredo-so-para-desenvolvimento-laivy'
const DUAS_HORAS = 2 * 60 * 60 * 1000

if (!process.env.JWT_SEGREDO) {
  console.warn('Aviso: usando o segredo padrão do JWT. Defina JWT_SEGREDO fora do desenvolvimento.')
}

const OPCOES_COOKIE = {
  httpOnly: true, // o JavaScript do navegador não lê este cookie
  sameSite: 'lax', // o navegador não envia o cookie em pedidos vindos de outros sites
  secure: process.env.NODE_ENV === 'production', // em produção, só por HTTPS
}

// Cria o token com os dados do usuário e o coloca no cookie da resposta.
export function iniciarSessao(res, usuario) {
  const token = jwt.sign(
    { id: usuario.id, login: usuario.login, nome: usuario.nome, tipo: usuario.tipo },
    SEGREDO,
    { expiresIn: '2h' },
  )
  res.cookie('token', token, { ...OPCOES_COOKIE, maxAge: DUAS_HORAS })
}

export function encerrarSessao(res) {
  res.clearCookie('token', OPCOES_COOKIE)
}

// "Porteiro" 1: só deixa passar quem está logado.
export function verificarLogin(req, res, next) {
  try {
    req.usuario = jwt.verify(req.cookies.token, SEGREDO)
    next()
  } catch {
    res.status(401).json({ mensagem: 'Você precisa entrar no sistema.' })
  }
}

// "Porteiro" 2: só deixa passar o administrador (use depois do verificarLogin).
export function somenteAdmin(req, res, next) {
  if (req.usuario.tipo !== 'Administrador') {
    return res.status(403).json({ mensagem: 'Apenas o administrador pode acessar.' })
  }
  next()
}
