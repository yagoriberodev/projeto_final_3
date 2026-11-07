import { useOutletContext } from 'react-router-dom'
import Card from '../componentes/Card'
import Botao from '../componentes/Botao'
import BotaoSair from '../componentes/BotaoSair'
import GraficoBarras from '../componentes/GraficoBarras'
import Tabela from '../componentes/Tabela'
import TopoPagina from '../componentes/TopoPagina'
import useAdmin from '../hooks/useAdmin'
import '../styles/Pagina.css'

const COLUNAS_USUARIOS = [
  { titulo: 'Nome', campo: 'nome' },
  { titulo: 'Login', campo: 'login' },
  { titulo: 'Perfil', campo: 'tipo' },
  { titulo: 'Times', campo: 'totalTimes' },
]

// Dashboard do administrador: mostra o sistema inteiro. Só o administrador entra.
function Admin() {
  const usuario = useOutletContext()
  const { dashboard, erro, excluir } = useAdmin()

  const colunasTimes = [
    { titulo: 'Time', campo: 'nome' },
    { titulo: 'Modalidade', campo: 'modalidade' },
    { titulo: 'Categoria', campo: 'categoria' },
    { titulo: 'Atletas', campo: 'atletas' },
    { titulo: 'Dono', campo: 'dono' },
    {
      titulo: 'Ações',
      render: (time) => (
        <Botao variante="secundario" onClick={() => excluir(time)}>
          Excluir
        </Botao>
      ),
    },
  ]

  return (
    <main className="pagina">
      <TopoPagina
        titulo="Painel do administrador"
        subtitulo={`Olá, ${usuario.nome}. Aqui você acompanha o sistema inteiro.`}
      >
        <Botao to="/times" variante="secundario">
          Ver times
        </Botao>
        <BotaoSair />
      </TopoPagina>

      {erro && <p className="pagina__erro" role="alert">{erro}</p>}

      {dashboard && (
        <>
          <section className="pagina__cartoes">
            <Card titulo="Usuários" valor={dashboard.totalUsuarios} detalhe="Cadastrados no sistema" />
            <Card titulo="Times" valor={dashboard.totalTimes} detalhe="De todos os usuários" />
            <Card titulo="Atletas" valor={dashboard.totalAtletas} detalhe="Somando todos os times" />
            <Card titulo="Modalidades" valor={dashboard.totalModalidades} detalhe="Diferentes modalidades" />
          </section>

          <section className="pagina__secao">
            <h2>Atletas por modalidade</h2>
            <GraficoBarras itens={dashboard.porModalidade} vazio="Nenhum time cadastrado." />
          </section>

          <section className="pagina__secao">
            <h2>Usuários</h2>
            <Tabela colunas={COLUNAS_USUARIOS} linhas={dashboard.usuarios} />
          </section>

          <section className="pagina__secao">
            <h2>Todos os times</h2>
            <Tabela colunas={colunasTimes} linhas={dashboard.times} vazio="Nenhum time cadastrado." />
          </section>
        </>
      )}
    </main>
  )
}

export default Admin
