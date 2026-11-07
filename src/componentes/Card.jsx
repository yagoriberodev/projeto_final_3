import '../styles/Card.css'

// Cartão de resumo reutilizável: título, valor em destaque, detalhe e (opcional) ações.
function Card({ titulo, valor, detalhe, children }) {
  return (
    <article className="card">
      <h2 className="card__titulo">{titulo}</h2>
      <p className="card__valor">{valor}</p>
      {detalhe && <p className="card__detalhe">{detalhe}</p>}
      {children && <div className="card__acoes">{children}</div>}
    </article>
  )
}

export default Card
