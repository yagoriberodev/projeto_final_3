# Relatório de alterações do LAIVY

## Entrega 1 – Início do projeto

Montei a base do site com React e Vite. Criei a tela de login e a página inicial com a imagem do LAIVY e o botão Entrar. Também organizei as pastas e fiz componentes que pude usar em várias telas, como botões, campos e cartões.

## Entrega 2 – Login e cadastro de times

Liguei o site ao servidor feito com Node.js e Express. O login passou a conferir os dados no MySQL. Também fiz a tela de times, onde o treinador pode cadastrar, listar e excluir seus times.

## Entrega 3 – Painéis e permissões

Criei um painel para o treinador acompanhar seus times, atletas e modalidades, com tabela e gráfico. No painel do administrador, coloquei a lista de usuários e times de todo o sistema, com a opção de excluir qualquer time.

Também protegi as páginas internas e coloquei as regras de acesso no servidor. Cada treinador só pode ver e gerenciar os próprios times. Passei a guardar a sessão em um cookie que vence em duas horas e a salvar as senhas no banco com bcrypt.

## Entrega 4 – Login com Google

Adicionei a opção de entrar com o Google usando o Firebase. O servidor confere o login e cria a sessão do site. Para configurar o login do Google no ambiente local, é preciso habilitar esse provedor no Firebase e autorizar o domínio localhost.

## Banco de dados no Docker

Configurei o MySQL para rodar no Docker na porta 3307. Os dados ficam em um volume, então continuam salvos quando o container é parado. A API usa o arquivo `server/banco.sql` para criar as tabelas e inserir os dados de exemplo. Deixei os passos para rodar o projeto no [README](README.md).

## Contas para testar

| Login | Senha | Perfil |
|---|---|---|
| `yago` | `123` | Treinador |
| `maria` | `123` | Treinador |
| `admin` | `admin` | Administrador |

## O que ainda quero melhorar

Quero limitar as tentativas de login, permitir a troca de senha pelo site e fazer uma tela para o administrador gerenciar usuários. Quando publicar o site, também quero configurar o HTTPS.
