// Conexão com o MySQL e criação do banco/tabelas.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import config from './config.js'

const pasta = path.dirname(fileURLToPath(import.meta.url))

// Se o seu banco "laivy" é da versão anterior, a tabela times ainda não tem
// a coluna usuario_id. Aqui ela é acrescentada sem apagar nenhum dado.
async function atualizarTabelaTimes(conexao) {
  const [coluna] = await conexao.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'laivy' AND table_name = 'times' AND column_name = 'usuario_id'`,
  )
  const [tabela] = await conexao.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'laivy' AND table_name = 'times'`,
  )

  // Tabela nova (o banco.sql cria já com a coluna) ou já atualizada: nada a fazer.
  if (tabela.length === 0 || coluna.length > 0) return

  await conexao.query(
    `ALTER TABLE laivy.times
       ADD COLUMN usuario_id INT NULL,
       ADD CONSTRAINT fk_times_usuario
         FOREIGN KEY (usuario_id) REFERENCES laivy.usuarios(id) ON DELETE SET NULL`,
  )
  // Os times que já existiam passam a ser do usuário "yago".
  await conexao.query(
    `UPDATE laivy.times SET usuario_id = (SELECT id FROM laivy.usuarios WHERE login = 'yago')`,
  )
}

// Se algum usuário ainda tem senha em texto puro (banco antigo), troca por hash.
async function protegerSenhasAntigas(conexao) {
  const [usuarios] = await conexao.query(
    `SELECT id, senha FROM laivy.usuarios WHERE senha NOT LIKE '$2%'`,
  )
  for (const usuario of usuarios) {
    const hash = await bcrypt.hash(usuario.senha, 10)
    await conexao.query('UPDATE laivy.usuarios SET senha = ? WHERE id = ?', [hash, usuario.id])
  }
}

// Cria o banco, as tabelas e os dados iniciais.
export async function prepararBanco() {
  const { database: _nomeDoBanco, ...semBanco } = config
  const conexao = await mysql.createConnection({ ...semBanco, multipleStatements: true })
  try {
    await conexao.query(
      'CREATE DATABASE IF NOT EXISTS laivy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    )
    await atualizarTabelaTimes(conexao)

    const sql = fs.readFileSync(path.join(pasta, 'banco.sql'), 'utf-8')
    await conexao.query(sql)

    await protegerSenhasAntigas(conexao)
  } finally {
    await conexao.end()
  }
}

// Conexões usadas pelas rotas.
export const pool = mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 5 })
