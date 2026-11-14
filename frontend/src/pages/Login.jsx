
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const {
    iniciarSesion,
    autenticado,
    cargando
  } = useAuth();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  if (autenticado) {
    return <Navigate to="/panel" replace />;
  }

  const ingresar = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await iniciarSesion(
        usuario.trim(),
        contrasena
      );

      setContrasena('');
      navigate('/panel', { replace: true });
    } catch (err) {
      setError(
        err.message || 'No se pudo iniciar sesión'
      );
    }
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
            disabled={cargando}
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
            disabled={cargando}
            required
          />

          {error && (
            <p
              role="alert"
              style={{
                color: '#dc2626',
                fontSize: '13px',
                marginTop: '12px'
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-boton"
            disabled={cargando}
          >
            {cargando ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-ayuda">
          ¿Olvidaste tu contraseña?
          Solicítala al administrador.
        </p>
      </div>
    </div>
  );
}

export default Login;
