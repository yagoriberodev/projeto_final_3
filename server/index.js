// Backend do LAIVY (Node + Express + MySQL).
import express from 'express'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import { randomBytes, createHash } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { pool, prepararBanco } from './banco.js'
import { iniciarSessao, encerrarSessao, verificarLogin, somenteAdmin } from './seguranca.js'

const app = express()
const firebaseApp = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'login-bb056',
})
app.use(express.json())
app.use(cookieParser()) // permite ler o cookie com o token

// Evita repetir try/catch em todas as rotas.
function rota(funcao) {
  return async (req, res) => {
    try {
      await funcao(req, res)
    } catch (erro) {
      console.error(erro)
      res.status(500).json({ mensagem: 'Erro no banco de dados.' })
    }
  }
}

function ehAdmin(usuario) {
  return usuario.tipo === 'Administrador'
}

// ---------- Login, sessão e logout ----------

// Login: confere a senha e guarda o token no cookie (o token NÃO vai na resposta).
app.post('/api/usuarios/login', rota(async (req, res) => {
  const { login, senha } = req.body || {}
  const [linhas] = await pool.query(
    'SELECT id, login, senha, nome, tipo FROM usuarios WHERE login = ?',
    [login],
  )
  const usuario = linhas[0]
  const senhaCerta = usuario && (await bcrypt.compare(String(senha ?? ''), usuario.senha))

  if (!senhaCerta) {
    return res.status(401).json({ mensagem: 'Login ou senha inválidos.' })
  }

  iniciarSessao(res, usuario)
  res.json({ id: usuario.id, login: usuario.login, nome: usuario.nome, tipo: usuario.tipo })
}))

app.post('/api/usuarios/login/google', rota(async (req, res) => {
  const { idToken } = req.body || {}
  if (typeof idToken !== 'string' || !idToken) {
    return res.status(400).json({ mensagem: 'Token do Google não informado.' })
  }

  let identidade
  try {
    identidade = await getAuth(firebaseApp).verifyIdToken(idToken)
  } catch (erro) {
    console.error('Falha ao validar token Firebase:', erro)
    return res.status(401).json({ mensagem: 'Token Google inválido ou expirado.' })
  }

  if (identidade.firebase?.sign_in_provider !== 'google.com' || !identidade.email || !identidade.email_verified) {
    return res.status(401).json({ mensagem: 'É necessário entrar com uma conta Google verificada.' })
  }

  let [usuarios] = await pool.query(
    'SELECT id, login, nome, tipo FROM usuarios WHERE firebase_uid = ?',
    [identidade.uid],
  )
  let usuario = usuarios[0]

  if (!usuario) {
    const login = `google_${createHash('sha256').update(identidade.uid).digest('hex').slice(0, 40)}`
    const nome = String(identidade.name || identidade.email).slice(0, 100)
    const senhaAleatoria = await bcrypt.hash(randomBytes(32).toString('hex'), 10)
    try {
      const [resultado] = await pool.query(
        'INSERT INTO usuarios (login, senha, nome, tipo, firebase_uid) VALUES (?, ?, ?, ?, ?)',
        [login, senhaAleatoria, nome, 'Treinador', identidade.uid],
      )
      usuario = { id: resultado.insertId, login, nome, tipo: 'Treinador' }
    } catch (erro) {
      if (erro.code !== 'ER_DUP_ENTRY') throw erro
      ;[usuarios] = await pool.query(
        'SELECT id, login, nome, tipo FROM usuarios WHERE firebase_uid = ?',
        [identidade.uid],
      )
      usuario = usuarios[0]
      if (!usuario) throw erro
    }
  }

  iniciarSessao(res, usuario)
  res.json({ id: usuario.id, login: usuario.login, nome: usuario.nome, tipo: usuario.tipo })
}))

// Quem sou eu? O front usa isto para saber se há alguém logado.
app.get('/api/me', verificarLogin, (req, res) => {
  const { id, login, nome, tipo } = req.usuario
  res.json({ id, login, nome, tipo })
})

// Sair: apaga o cookie.
app.post('/api/logout', (req, res) => {
  encerrarSessao(res)
  res.status(204).end()
})

// ---------- Times ----------

// Listar times: o cliente vê só os dele; o administrador vê todos.
app.get('/api/times', verificarLogin, rota(async (req, res) => {
  const sql = `SELECT t.id, t.nome, t.modalidade, t.categoria, t.atletas, u.nome AS dono
               FROM times t LEFT JOIN usuarios u ON u.id = t.usuario_id`
  const [times] = ehAdmin(req.usuario)
    ? await pool.query(`${sql} ORDER BY t.id`)
    : await pool.query(`${sql} WHERE t.usuario_id = ? ORDER BY t.id`, [req.usuario.id])
  res.json(times)
}))

// Cadastrar time: o dono é o usuário logado.
app.post('/api/times', verificarLogin, rota(async (req, res) => {
  const { nome, modalidade, categoria, atletas } = req.body || {}
  const qtd = Number(atletas)

  if (!nome?.trim() || !modalidade?.trim() || !categoria?.trim()) {
    return res.status(400).json({ mensagem: 'Preencha nome, modalidade e categoria.' })
  }
  if (!Number.isInteger(qtd) || qtd < 0) {
    return res.status(400).json({ mensagem: 'A quantidade de atletas deve ser um número inteiro.' })
  }

  const novo = { nome: nome.trim(), modalidade: modalidade.trim(), categoria: categoria.trim(), atletas: qtd }
  const [resultado] = await pool.query(
    'INSERT INTO times (nome, modalidade, categoria, atletas, usuario_id) VALUES (?, ?, ?, ?, ?)',
    [novo.nome, novo.modalidade, novo.categoria, novo.atletas, req.usuario.id],
  )
  res.status(201).json({ id: resultado.insertId, ...novo, dono: req.usuario.nome })
}))

// Excluir time: o cliente só exclui os dele; o administrador exclui qualquer um.
app.delete('/api/times/:id', verificarLogin, rota(async (req, res) => {
  const id = Number(req.params.id)
  const [resultado] = ehAdmin(req.usuario)
    ? await pool.query('DELETE FROM times WHERE id = ?', [id])
    : await pool.query('DELETE FROM times WHERE id = ? AND usuario_id = ?', [id, req.usuario.id])

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ mensagem: 'Time não encontrado.' })
  }
  res.status(204).end()
}))

// ---------- Dashboards ----------

// Dashboard do cliente: só os dados do próprio usuário.
app.get('/api/dashboard/cliente', verificarLogin, rota(async (req, res) => {
  const [times] = await pool.query(
    'SELECT id, nome, modalidade, categoria, atletas FROM times WHERE usuario_id = ? ORDER BY id',
    [req.usuario.id],
  )
  res.json({
    totalTimes: times.length,
    totalAtletas: times.reduce((soma, time) => soma + time.atletas, 0),
    totalModalidades: new Set(times.map((time) => time.modalidade)).size,
    times,
  })
}))

// Dashboard do administrador: o sistema inteiro. Só o administrador entra.
app.get('/api/dashboard/admin', verificarLogin, somenteAdmin, rota(async (req, res) => {
  const [[totais]] = await pool.query(
    `SELECT (SELECT COUNT(*) FROM usuarios) AS totalUsuarios,
            COUNT(*) AS totalTimes,
            COALESCE(SUM(atletas), 0) AS totalAtletas,
            COUNT(DISTINCT modalidade) AS totalModalidades
     FROM times`,
  )
  const [usuarios] = await pool.query(
    `SELECT u.id, u.login, u.nome, u.tipo, COUNT(t.id) AS totalTimes
     FROM usuarios u LEFT JOIN times t ON t.usuario_id = u.id
     GROUP BY u.id, u.login, u.nome, u.tipo
     ORDER BY u.id`,
  )
  const [times] = await pool.query(
    `SELECT t.id, t.nome, t.modalidade, t.categoria, t.atletas, u.nome AS dono
     FROM times t LEFT JOIN usuarios u ON u.id = t.usuario_id
     ORDER BY t.id`,
  )
  const [porModalidade] = await pool.query(
    `SELECT modalidade AS rotulo, SUM(atletas) AS valor
     FROM times GROUP BY modalidade ORDER BY valor DESC`,
  )

  res.json({
    totalUsuarios: Number(totais.totalUsuarios),
    totalTimes: Number(totais.totalTimes),
    totalAtletas: Number(totais.totalAtletas),
    totalModalidades: Number(totais.totalModalidades),
    usuarios: usuarios.map((u) => ({ ...u, totalTimes: Number(u.totalTimes) })),
    times,
    porModalidade: porModalidade.map((item) => ({ rotulo: item.rotulo, valor: Number(item.valor) })),
  })
}))

const PORTA = 3001

try {
  await prepararBanco()
  console.log('Banco "laivy" pronto no MySQL.')
} catch (erro) {
  console.error('\nNão foi possível conectar ao MySQL.')
  console.error('Confira se o MySQL está ligado e se o usuário e a senha em server/config.js estão certos.')
  console.error(`Detalhe: ${erro.code || erro.message}\n`)
  process.exit(1)
}

app.listen(PORTA, () => {
  console.log(`API do LAIVY rodando em http://localhost:${PORTA}`)
})
