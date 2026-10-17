
import './Login.css';

function Login() {
  return (
    <div className="login-pagina">
      <div className="login-tarjeta">

        <div className="login-logo">LH</div>

        <h1 className="login-empresa">
          Llantas y Servicios La Huerta
        </h1>

        <p className="login-area">
          Coordinación operativa
        </p>

        <h2 className="login-subtitulo">
          Iniciar sesión
        </h2>

        <form>
          <label className="login-label">Usuario</label>
          <div className="login-campo">
            <input type="text" placeholder="Ingresa tu usuario" />
          </div>

          <label className="login-label">Contraseña</label>
          <div className="login-campo">
            <input type="password" placeholder="Ingresa tu contraseña" />
          </div>

          <label className="login-recordar">
            <input type="checkbox" />
            Recordar usuario
          </label>

          <button type="button" className="login-boton">
            Entrar
          </button>
        </form>

        <p className="login-ayuda">
          ¿Olvidaste tu contraseña? Solicítala a la administradora.
        </p>

      </div>
    </div>
  );
}

export default Login;
