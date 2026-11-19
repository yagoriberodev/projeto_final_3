# LAIVY

## Banco de dados no Docker

Na pasta `site-tcc`, com o Docker Desktop aberto e o Node.js instalado, copie a configuração de exemplo no PowerShell.

```powershell
Copy-Item .env.example .env
```

Preencha `DB_SENHA` no `.env` com uma senha para o usuário do banco. Depois execute:

```powershell
npm.cmd ci
docker compose up -d --wait
npm.cmd start
```

O MySQL 8.4 fica disponível em `127.0.0.1:3307`. A API prepara as tabelas ao iniciar e o Vite informa o endereço do site no terminal. Se a porta estiver ocupada, ajuste `DB_PORT` no `.env` antes de subir o banco.

Use `docker compose stop` para parar o banco. O volume do Docker preserva os dados entre reinícios. Se você já tem registros em outro MySQL, exporte o banco `laivy` e importe o backup no container antes da primeira execução de `npm start`.
