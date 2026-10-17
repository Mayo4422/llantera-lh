import React, { Component } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Pantalla de inicio según el rol (CU-01, paso 4)
const RUTA_POR_ROL = {
  Taller: '/taller',
  'Recepción': '/recepcion',
  Superadministradora: '/recepcion',
};

const CLAVE_RECORDAR = 'llantera_usuario_recordado';

// Íconos de la interfaz
const IconoLogo = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3v5.8M12 15.2V21M3 12h5.8M15.2 12H21" />
  </svg>
);
const IconoUsuario = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);
const IconoCandado = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconoOjo = ({ tachado }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {tachado && <path d="M3 3l18 18" />}
  </svg>
);
const IconoAlerta = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

class Login extends Component {
  constructor(props) {
    super(props);
    let recordado = '';
    try {
      recordado = localStorage.getItem(CLAVE_RECORDAR) || '';
    } catch (e) {
      recordado = '';
    }
    this.state = {
      usuario: recordado,
      contrasena: '',
      recordar: recordado !== '',
      verContrasena: false,
      cargando: false,
      error: '',
      debeCambiar: false,
      nuevaContrasena: '',
      confirmarContrasena: '',
    };
  }

  manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({ [name]: type === 'checkbox' ? checked : value, error: '' });
  };

  alternarVerContrasena = () => {
    this.setState((prev) => ({ verContrasena: !prev.verContrasena }));
  };

  guardarSesion(token, usuario) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  recordarUsuario(usuario) {
    try {
      if (this.state.recordar) localStorage.setItem(CLAVE_RECORDAR, usuario);
      else localStorage.removeItem(CLAVE_RECORDAR);
    } catch (e) {
      // El navegador no permite guardar; se ignora
    }
  }

  irAInicio(usuario) {
    const ruta = RUTA_POR_ROL[usuario.rol] || '/';
    if (this.props.onLoginExitoso) this.props.onLoginExitoso(usuario, ruta);
    else window.location.assign(ruta);
  }

  iniciarSesion = async (e) => {
    e.preventDefault();
    const usuario = this.state.usuario.trim();
    const { contrasena } = this.state;

    if (!usuario || !contrasena) {
      this.setState({ error: 'Ingresa tu usuario y tu contraseña' });
      return;
    }

    this.setState({ cargando: true, error: '' });
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
      });
      const datos = await resp.json();

      if (!resp.ok) {
        this.setState({ error: datos.mensaje || 'Usuario o contraseña incorrectos', cargando: false });
        return;
      }

      this.recordarUsuario(usuario);
      this.guardarSesion(datos.token, datos.usuario);

      if (datos.usuario.debeCambiarContrasena) {
        this.setState({ debeCambiar: true, cargando: false, contrasena: '' });
        return;
      }
      this.irAInicio(datos.usuario);
    } catch (err) {
      this.setState({ error: 'No hay conexión con el servidor', cargando: false });
    }
  };

  cambiarContrasena = async (e) => {
    e.preventDefault();
    const { nuevaContrasena, confirmarContrasena } = this.state;

    if (nuevaContrasena.length < 8) {
      this.setState({ error: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      this.setState({ error: 'Las contraseñas no coinciden' });
      return;
    }

    this.setState({ cargando: true, error: '' });
    try {
      const token = sessionStorage.getItem('token');
      const resp = await fetch(`${API_URL}/api/auth/cambiar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nuevaContrasena }),
      });
      const datos = await resp.json();

      if (!resp.ok) {
        this.setState({ error: datos.mensaje || 'No se pudo cambiar la contraseña', cargando: false });
        return;
      }

      const usuario = { ...JSON.parse(sessionStorage.getItem('usuario')), debeCambiarContrasena: false };
      this.guardarSesion(token, usuario);
      this.irAInicio(usuario);
    } catch (err) {
      this.setState({ error: 'No hay conexión con el servidor', cargando: false });
    }
  };

  renderError() {
    if (!this.state.error) return null;
    return (
      <div className="login-error" role="alert">
        <IconoAlerta />
        <span>{this.state.error}</span>
      </div>
    );
  }

  renderCampoContrasena(nombre, placeholder, autoComplete) {
    const { verContrasena } = this.state;
    return (
      <div className="login-campo">
        <span className="login-icono"><IconoCandado /></span>
        <input
          id={nombre}
          name={nombre}
          type={verContrasena ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={this.state[nombre]}
          onChange={this.manejarCambio}
        />
        <button
          type="button"
          className="login-ojo"
          onClick={this.alternarVerContrasena}
          aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <IconoOjo tachado={verContrasena} />
        </button>
      </div>
    );
  }

  renderInicioSesion() {
    const { usuario, recordar, cargando } = this.state;
    return (
      <form onSubmit={this.iniciarSesion} noValidate>
        <h2 className="login-subtitulo">Iniciar sesión</h2>

        <label className="login-label" htmlFor="usuario">Usuario</label>
        <div className="login-campo">
          <span className="login-icono"><IconoUsuario /></span>
          <input
            id="usuario"
            name="usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            value={usuario}
            onChange={this.manejarCambio}
            autoFocus={!usuario}
          />
        </div>

        <label className="login-label" htmlFor="contrasena">Contraseña</label>
        {this.renderCampoContrasena('contrasena', '••••••••', 'current-password')}

        <label className="login-recordar">
          <input type="checkbox" name="recordar" checked={recordar} onChange={this.manejarCambio} />
          Recordar usuario
        </label>

        <button type="submit" className="login-boton" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>

        {this.renderError()}

        <p className="login-ayuda">¿Olvidaste tu contraseña? Solicítala a la administradora.</p>
      </form>
    );
  }

  renderCambioContrasena() {
    const { cargando } = this.state;
    return (
      <form onSubmit={this.cambiarContrasena} noValidate>
        <h2 className="login-subtitulo">Crea tu contraseña</h2>
        <p className="login-nota">Es tu primer acceso. Cambia la contraseña temporal para continuar.</p>

        <label className="login-label" htmlFor="nuevaContrasena">Nueva contraseña</label>
        {this.renderCampoContrasena('nuevaContrasena', 'Mínimo 8 caracteres', 'new-password')}

        <label className="login-label" htmlFor="confirmarContrasena">Confirmar contraseña</label>
        {this.renderCampoContrasena('confirmarContrasena', 'Repite la contraseña', 'new-password')}

        <button type="submit" className="login-boton" disabled={cargando}>
          {cargando ? 'Guardando…' : 'Guardar y entrar'}
        </button>

        {this.renderError()}
      </form>
    );
  }

  render() {
    return (
      <div className="login-pagina">
        <div className="login-tarjeta">
          <div className="login-logo"><IconoLogo /></div>
          <h1 className="login-empresa">Llantas y Servicios La Huerta</h1>
          <p className="login-area">Coordinación operativa</p>

          {this.state.debeCambiar ? this.renderCambioContrasena() : this.renderInicioSesion()}
        </div>
      </div>
    );
  }
}

export default Login;