import '../styles/GraficoBarras.css'

// Gráfico de barras simples (só HTML e CSS).
// itens: [{ rotulo: 'Futsal', valor: 14 }]
function GraficoBarras({ itens, vazio = 'Sem dados para mostrar.' }) {
  if (itens.length === 0) {
    return <p>{vazio}</p>
  }

  const maior = Math.max(...itens.map((item) => item.valor))

  return (
    <div className="grafico">
      {itens.map((item) => (
        <div className="grafico__linha" key={item.rotulo}>
          <span className="grafico__rotulo">{item.rotulo}</span>
          <div className="grafico__trilho">
            <div
              className="grafico__barra"
              style={{ width: maior > 0 ? `${(item.valor / maior) * 100}%` : '0%' }}
            />
          </div>
          <span className="grafico__valor">{item.valor}</span>
        </div>
      ))}
    </div>
  )
}

export default GraficoBarras
