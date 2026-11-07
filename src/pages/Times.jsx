import Campo from '../componentes/Campo'
import Botao from '../componentes/Botao'
import Card from '../componentes/Card'
import TopoPagina from '../componentes/TopoPagina'
import useTimes from '../hooks/useTimes'
import '../styles/Pagina.css'
import '../styles/Times.css'

function Times() {
  const { times, form, erro, carregando, atualizarCampo, cadastrar, excluir } = useTimes()

  return (
    <main className="pagina times">
      <TopoPagina titulo="Times">
        <Botao to="/usuario" variante="secundario">
          Voltar
        </Botao>
      </TopoPagina>

      <form className="times__form" onSubmit={cadastrar}>
        <h2>Cadastrar time</h2>
        <div className="times__campos">
          <Campo id="nome" label="Nome" placeholder="Ex.: Tigres" value={form.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)} />
          <Campo id="modalidade" label="Modalidade" placeholder="Ex.: Futsal" value={form.modalidade}
            onChange={(e) => atualizarCampo('modalidade', e.target.value)} />
          <Campo id="categoria" label="Categoria" placeholder="Ex.: Sub-17" value={form.categoria}
            onChange={(e) => atualizarCampo('categoria', e.target.value)} />
          <Campo id="atletas" label="Atletas" type="number" placeholder="Ex.: 14" value={form.atletas}
            onChange={(e) => atualizarCampo('atletas', e.target.value)} />
        </div>
        <Botao type="submit">Cadastrar time</Botao>
      </form>

      {erro && <p className="times__erro" role="alert">{erro}</p>}

      <section>
        <h2>Times cadastrados</h2>
        {carregando && <p>Carregando...</p>}
        {!carregando && times.length === 0 && <p>Nenhum time cadastrado ainda.</p>}

        <div className="times__lista">
          {times.map((time) => (
            <Card
              key={time.id}
              titulo={time.modalidade}
              valor={time.nome}
              detalhe={`${time.categoria} · ${time.atletas} atletas`}
            >
              <Botao variante="secundario" onClick={() => excluir(time.id)}>
                Excluir
              </Botao>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Times
