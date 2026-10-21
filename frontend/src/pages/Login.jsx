
import { Link } from 'react-router-dom';
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

        <label className="login-label">Usuario</label>
        <input
          className="login-input"
          type="text"
          placeholder="Ingresa tu usuario"
        />

        <label className="login-label">Contraseña</label>
        <input
          className="login-input"
          type="password"
          placeholder="Ingresa tu contraseña"
        />

        <label className="login-recordar">
          <input type="checkbox" />
          Recordar usuario
        </label>

        <button type="button" className="login-boton">
          Ingresar
        </button>

        <p className="login-ayuda">
          ¿Olvidaste tu contraseña? Solicítala a la administradora.
        </p>

        <Link className="login-enlace" to="/usuarios">
          Ver usuarios
        </Link>

      </div>
    </div>
  );
}

export default Login;
