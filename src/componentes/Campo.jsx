import '../styles/Campo.css'

// Campo de formulário reutilizável: rótulo + input.
function Campo({ id, label, type = 'text', placeholder, value, onChange }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Campo
