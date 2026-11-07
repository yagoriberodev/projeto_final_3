import '../styles/TopoPagina.css'

// Topo das páginas internas: título, subtítulo e botões (children).
function TopoPagina({ titulo, subtitulo, children }) {
  return (
    <header className="topo-pagina">
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children && <div className="topo-pagina__acoes">{children}</div>}
    </header>
  )
}

export default TopoPagina
