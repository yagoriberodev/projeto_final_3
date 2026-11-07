// Configuração da conexão com o MySQL.
// NÃO escreva a senha aqui: o repositório do GitHub é público.
// Informe a senha pelo terminal, antes de rodar o projeto:
//   PowerShell:  $env:DB_SENHA="sua_senha"
//   Se o usuário não for root:  $env:DB_USER="seu_usuario"
export default {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_SENHA ?? '',
  database: 'laivy',
}
