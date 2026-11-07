import { useOutletContext } from 'react-router-dom'
import Card from '../componentes/Card'
import Botao from '../componentes/Botao'
import BotaoSair from '../componentes/BotaoSair'
import GraficoBarras from '../componentes/GraficoBarras'
import Tabela from '../componentes/Tabela'
import TopoPagina from '../componentes/TopoPagina'
import useUsuario from '../hooks/useUsuario'
import '../styles/Pagina.css'

const COLUNAS_TIMES = [
  { titulo: 'Time', campo: 'nome' },
  { titulo: 'Modalidade', campo: 'modalidade' },
  { titulo: 'Categoria', campo: 'categoria' },
  { titulo: 'Atletas', campo: 'atletas' },
]

// Dashboard do cliente: mostra só os dados do usuário logado.
function Usuario() {
  const usuario = useOutletContext()
  const { dashboard, erro } = useUsuario()

  return (
    <main className="pagina">
      <TopoPagina
        titulo={`Olá, ${usuario.nome}`}
        subtitulo="Bem-vindo ao LAIVY. Este é o resumo dos seus times."
      >
        <Botao to="/times">Gerenciar times</Botao>
        <BotaoSair />
      </TopoPagina>

      {erro && <p className="pagina__erro" role="alert">{erro}</p>}

      {dashboard && (
        <>
          <section className="pagina__cartoes">
            <Card titulo="Tipo de usuário" valor={usuario.tipo} detalhe="Acesso ao sistema" />
            <Card titulo="Meus times" valor={dashboard.totalTimes} detalhe="Cadastrados por você" />
            <Card titulo="Meus atletas" valor={dashboard.totalAtletas} detalhe="Somando os seus times" />
            <Card titulo="Modalidades" valor={dashboard.totalModalidades} detalhe="Diferentes modalidades" />
          </section>

          <section className="pagina__secao">
            <h2>Atletas por time</h2>
            <GraficoBarras
              itens={dashboard.times.map((time) => ({ rotulo: time.nome, valor: time.atletas }))}
              vazio="Você ainda não cadastrou nenhum time."
            />
          </section>

          <section className="pagina__secao">
            <h2>Meus times</h2>
            <Tabela colunas={COLUNAS_TIMES} linhas={dashboard.times} vazio="Você ainda não cadastrou nenhum time." />
          </section>
        </>
      )}
    </main>
  )
}

export default Usuario
