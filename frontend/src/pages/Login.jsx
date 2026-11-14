
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);

  const ingresar = (e) => {
    e.preventDefault();

    // Navegación provisional del prototipo.
    // Todavía no existe autenticación real.
    navigate('/panel');
  };

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

        <form onSubmit={ingresar}>

          <label
            className="login-label"
            htmlFor="login-usuario"
          >
            Usuario
          </label>

          <input
            id="login-usuario"
            className="login-input"
            type="text"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />

          <label
            className="login-label"
            htmlFor="login-contrasena"
          >
            Contraseña
          </label>

          <input
            id="login-contrasena"
            className="login-input"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label className="login-recordar">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
            Recordar usuario
          </label>

          <button
            type="submit"
            className="login-boton"
          >
            Ingresar
          </button>

        </form>

        <p className="login-ayuda">
          ¿Olvidaste tu contraseña?
          Solicítala a la administradora.
        </p>

      </div>
    </div>
  );
}

export default Login;
