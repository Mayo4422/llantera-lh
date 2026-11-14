
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function CambiarContrasena() {
  const navigate = useNavigate();
  const { token, cerrarSesion, actualizarUsuario } = useAuth();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    if (nueva !== confirmacion) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/auth/cambiar-contrasena',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            contrasenaActual: actual,
            contrasenaNueva: nueva
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje);
      }

      actualizarUsuario({
        debe_cambiar_contrasena: false
      });

      setActual('');
      setNueva('');
      setConfirmacion('');

      navigate('/panel', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-pagina">
      <div className="login-tarjeta">
        <div className="login-logo">LH</div>

        <h1 className="login-empresa">
          Llantas y Servicios La Huerta
        </h1>

        <h2 className="login-subtitulo">
          Cambiar contraseña
        </h2>

        <p className="login-area">
          Por seguridad debes establecer una contraseña nueva.
        </p>

        <form onSubmit={guardar}>
          <label className="login-label">
            Contraseña actual
          </label>
          <input
            className="login-input"
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            autoComplete="current-password"
            required
          />

          <label className="login-label">
            Nueva contraseña
          </label>
          <input
            className="login-input"
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            autoComplete="new-password"
            minLength={12}
            required
          />

          <label className="login-label">
            Confirmar nueva contraseña
          </label>
          <input
            className="login-input"
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            autoComplete="new-password"
            minLength={12}
            required
          />

          {error && (
            <p role="alert" style={{ color: '#dc2626' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-boton"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            cerrarSesion();
            navigate('/', { replace: true });
          }}
          style={{
            marginTop: '16px',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default CambiarContrasena;
