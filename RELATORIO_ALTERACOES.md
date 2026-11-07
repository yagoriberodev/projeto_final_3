# Relatório de alterações - LAIVY (Frontend)

Frontend do TCC em React + Vite, com backend em Node (Express) e banco MySQL.
Este relatório mostra o que foi adicionado ao projeto em cada entrega.

## Entrega 1 - Base do projeto

- Projeto React com `react-router-dom`.
- Tela de login e tela inicial (com a imagem do LAIVY e o botão **Entrar**).
- Estrutura de pastas `hooks`, `services`, `pages`, `styles`, `componentes` e `assets`.
- `App.jsx` só com as rotas e componentes reaproveitados (`Botao`, `Campo`, `Card`, `Footer`, `Layout`).

## Entrega 2 - Telas funcionando com o backend

- **Login real:** `POST /api/usuarios/login` confere login e senha no MySQL.
- **Tela inicial** liga o usuário ao seu painel.
- **Funcionalidade principal: gerenciar times** (cadastrar, listar e excluir), gravando no MySQL.
- **Backend** em `server/` (Express + mysql2). O banco e as tabelas são criados sozinhos ao iniciar (`server/banco.sql`).
- O front conversa com o backend só pela pasta `services`, usando uma função única (`api.js`).

## Entrega 3 - Área administrativa (o que foi adicionado agora)

### 1. Segurança do login (token fora do localStorage)

- O login gera um **token JWT** e o backend o guarda num **cookie `httpOnly`**.
- Cookie `httpOnly` não pode ser lido por JavaScript. O navegador o envia sozinho a cada pedido.
- O front **não usa `localStorage` nem `sessionStorage`** em nenhum lugar. O token também não vem no corpo da resposta do login.
- Para saber quem está logado, o front pergunta ao backend: `GET /api/me`.
- O cookie tem `SameSite=Lax` (não é enviado em pedidos de outros sites) e vence em 2 horas.
- As senhas agora ficam no banco com **hash bcrypt**, nunca em texto puro. Bancos antigos são convertidos automaticamente.

**Como mostrar isso à banca:** abra o navegador, aperte F12, vá em **Application**.
Em *Local Storage* e *Session Storage* não há nada. Em *Cookies* aparece o `token` com a caixa **HttpOnly** marcada.

### 2. Dashboard do cliente (`/usuario`)

Mostra só os dados do usuário logado:
- cartões: tipo de usuário, meus times, meus atletas e modalidades;
- gráfico de atletas por time;
- tabela dos seus times;
- botões **Gerenciar times** e **Sair**.

### 3. Dashboard do administrador (`/admin`)

Só o administrador entra. Mostra o sistema inteiro:
- cartões: usuários, times, atletas e modalidades;
- gráfico de atletas por modalidade;
- tabela de todos os usuários (com quantos times cada um tem);
- tabela de todos os times, com o dono, e opção de **excluir qualquer time**.

### 4. Permissões

| Quem | O que pode |
|---|---|
| Sem login | Só a tela de login. Qualquer outra rota volta para o login. |
| Cliente (Treinador) | Ver, cadastrar e excluir **os seus** times. Não acessa `/admin` (volta para `/usuario`). |
| Administrador | Tudo: vê todos os times e usuários e exclui qualquer time. |

As regras valem no **front e no backend**. O backend é quem de fato protege os dados: mesmo que alguém altere a tela, ele responde 401 (não logado) ou 403 (sem permissão).

### 5. Backend (rotas)

| Rota | Quem acessa | O que faz |
|---|---|---|
| `POST /api/usuarios/login` | Todos | Confere a senha e cria o cookie |
| `GET /api/me` | Logado | Devolve quem está logado |
| `POST /api/logout` | Todos | Apaga o cookie |
| `GET /api/times` | Logado | Cliente: os seus times. Admin: todos |
| `POST /api/times` | Logado | Cadastra um time (o dono é quem está logado) |
| `DELETE /api/times/:id` | Logado | Cliente: só os seus. Admin: qualquer um |
| `GET /api/dashboard/cliente` | Logado | Números e times do dashboard do cliente |
| `GET /api/dashboard/admin` | Só administrador | Números, usuários e times do sistema |

Dois "porteiros" (middlewares) em `server/seguranca.js` cuidam das permissões: `verificarLogin` (401) e `somenteAdmin` (403).

### 6. Banco de dados

- `usuarios`: a senha agora é um hash bcrypt.
- `times`: **nova coluna `usuario_id`** (o dono do time), ligada a `usuarios` por chave estrangeira.
- Se o seu banco `laivy` é da versão anterior, o servidor **acrescenta a coluna sozinho** e passa os times antigos para o usuário `yago`. Nenhum dado é apagado.
- Usuário novo de teste: `maria`, com um time, para mostrar que cada cliente só vê o que é dele.

### 7. Componentes novos (reaproveitados)

| Componente | Onde é usado |
|---|---|
| `RotaProtegida` | Protege todas as páginas internas (App.jsx) |
| `TopoPagina` | Usuário, Admin e Times |
| `Tabela` | Usuário (1 vez) e Admin (2 vezes) |
| `GraficoBarras` | Usuário e Admin |
| `BotaoSair` | Usuário e Admin |
| `Card` (já existia) | Usuário, Admin e Times |

## Arquivos

**Novos**
- Backend: `server/seguranca.js`
- Componentes: `RotaProtegida`, `TopoPagina`, `Tabela`, `GraficoBarras`, `BotaoSair`
- Hooks: `useSessao`, `useAdmin`
- Páginas: `Admin.jsx`
- Services: `dashboardService.js`
- Estilos: `Pagina.css`, `TopoPagina.css`, `Tabela.css`, `GraficoBarras.css`

**Alterados**
- Backend: `server/index.js`, `server/banco.js`, `server/banco.sql`, `server/config.js`
- Front: `App.jsx` (novas rotas e proteção), `api.js` (cookie e sessão vencida), `authService.js` (sem localStorage), `useUsuario.js`, `Inicio.jsx`, `Usuario.jsx`, `Times.jsx`, `Times.css`
- `package.json`: novas bibliotecas `jsonwebtoken`, `cookie-parser` e `bcryptjs`

**Removidos**
- `usuarioService.js` (substituído por `dashboardService.js`)
- `Usuario.css` (substituído por `Pagina.css` e `TopoPagina.css`)

Não foram alterados: `Login.jsx`, `Login.css`, `Botao`, `Campo`, `Card`, `Footer`, `Layout` e a imagem do LAIVY.

## Como rodar

1. Deixe o **MySQL ligado**.
2. No terminal, na pasta do projeto:

```
npm install
$env:DB_SENHA="sua_senha_do_mysql"
npm start
```

3. Abra `http://localhost:5173`.

A senha do MySQL vai só pelo terminal (o repositório é público). Se o usuário do MySQL não for `root`, defina também `$env:DB_USER="seu_usuario"`.

**Usuários para testar**

| Login | Senha | Perfil |
|---|---|---|
| `yago` | `123` | Cliente (Treinador) |
| `maria` | `123` | Cliente (Treinador) |
| `admin` | `admin` | Administrador |

## Melhorias futuras

- Limitar tentativas de login (hoje não há bloqueio contra tentativas repetidas).
- Usar HTTPS e a variável `JWT_SEGREDO` quando o sistema for publicado.
- Tela para o administrador cadastrar e excluir usuários.
- Trocar de senha dentro do sistema.
