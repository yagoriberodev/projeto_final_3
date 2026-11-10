import Campo from '../componentes/Campo'
import Botao from '../componentes/Botao'
import useLogin from '../hooks/useLogin'
import '../styles/Login.css'

function Login() {
  const { loginDigitado, setLoginDigitado, senha, setSenha, erro, entrar, entrarComGoogle, carregandoGoogle } = useLogin()

  return (
    <main className="login">
      <form className="login__form" onSubmit={entrar}>
        <h1>Entrar</h1>

        <Campo
          id="login"
          label="Login"
          placeholder="Digite seu login"
          value={loginDigitado}
          onChange={(e) => setLoginDigitado(e.target.value)}
        />

        <Campo
          id="senha"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && (
          <p className="login__erro" role="alert">
            {erro}
          </p>
        )}

        <Botao type="submit">Entrar</Botao>

        <div className="login__divisor" aria-hidden="true"><span>ou</span></div>

        <Botao type="button" variante="secundario" onClick={entrarComGoogle} disabled={carregandoGoogle}>
          {carregandoGoogle ? 'Conectando...' : 'Entrar com Google'}
        </Botao>
      </form>
    </main>
  )
}

export default Login
