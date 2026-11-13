
function FormularioUsuario() {
  return (
    <>
      <div className="campo-formulario">
        <label htmlFor="usuario-nombre">
          Nombre completo
        </label>
        <input
          id="usuario-nombre"
          type="text"
          placeholder="Nombre del empleado"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="usuario-login">
          Nombre de usuario
        </label>
        <input
          id="usuario-login"
          type="text"
          placeholder="Usuario para iniciar sesión"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="usuario-contrasena">
          Contraseña
        </label>
        <input
          id="usuario-contrasena"
          type="password"
          placeholder="Ingresa una contraseña"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="usuario-rol">
          Rol
        </label>
        <select id="usuario-rol" defaultValue="">
          <option value="" disabled>
            Seleccionar rol
          </option>
          <option value="administrador">
            Administrador
          </option>
          <option value="mecanico">
            Mecánico
          </option>
          <option value="cajero">
            Cajero
          </option>
        </select>
      </div>
    </>
  );
}

export default FormularioUsuario;
