// Configuração da conexão com o MySQL.
// npm run api carrega as credenciais do arquivo .env, se existir.
export default {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_SENHA ?? '',
  database: 'laivy',
}
