import '../styles/Tabela.css'

// Tabela reutilizável.
// colunas: [{ titulo: 'Nome', campo: 'nome' }]. Para algo especial (um botão, por
// exemplo), use "render": { titulo: 'Ações', render: (linha) => <Botao>...</Botao> }.
function Tabela({ colunas, linhas, vazio = 'Nenhum registro.' }) {
  if (linhas.length === 0) {
    return <p>{vazio}</p>
  }

  return (
    <div className="tabela__rolagem">
      <table className="tabela">
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.titulo}>{coluna.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.id}>
              {colunas.map((coluna) => (
                <td key={coluna.titulo}>
                  {coluna.render ? coluna.render(linha) : (linha[coluna.campo] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Tabela
