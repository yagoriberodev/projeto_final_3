import { Link } from 'react-router-dom'
import '../styles/Botao.css'

// Botão reutilizável. Com "to" vira um link para outra página;
// sem "to" é um botão normal (submit, clique...).
function Botao({ children, to, type = 'button', onClick, variante = 'principal', disabled = false }) {
  const classe = `botao botao--${variante}`

  if (to) {
    return (
      <Link className={classe} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classe} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Botao
