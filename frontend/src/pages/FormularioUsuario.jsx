
function FormularioUsuario({
  valores,
  onChange,
  editando = false,
  error = ''
}) {
  function actualizar(event) {
    const { name, value } = event.target;

    onChange({
      ...valores,
      [name]: value
    });
  }

  return (
    <>
      {error && (
        <p role="alert" style={{ color: '#dc2626' }}>
          {error}
        </p>
      )}

      <div className="campo-formulario">
        <label htmlFor="usuario-nombre">
          Nombre completo
        </label>

        <input
          id="usuario-nombre"
          name="nombre_completo"
          type="text"
          maxLength={100}
          autoComplete="name"
          placeholder="Nombre del empleado"
          value={valores.nombre_completo}
          onChange={actualizar}
          required
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="usuario-login">
          Nombre de usuario
        </label>

        <input
          id="usuario-login"
          name="usuario"
          type="text"
          maxLength={30}
          autoComplete="off"
          placeholder="Usuario para iniciar sesión"
          value={valores.usuario}
          onChange={actualizar}
          required
        />
      </div>

      {!editando && (
        <div className="campo-formulario">
          <label htmlFor="usuario-contrasena">
            Contraseña temporal
          </label>

          <input
            id="usuario-contrasena"
            name="contrasena"
            type="password"
            minLength={12}
            autoComplete="new-password"
            placeholder="Mínimo 12 caracteres"
            value={valores.contrasena}
            onChange={actualizar}
            required
          />

          <small>
            El empleado deberá cambiarla al iniciar sesión.
          </small>
        </div>
      )}

      <div className="campo-formulario">
        <label htmlFor="usuario-rol">
          Rol
        </label>

        <select
          id="usuario-rol"
          name="id_rol"
          value={valores.id_rol}
          onChange={actualizar}
          required
        >
          <option value="">
            Seleccionar rol
          </option>

          <option value="1">Mecánico</option>
          <option value="2">Cajero</option>
          <option value="3">Administrador</option>
        </select>
      </div>
    </>
  );
}

export default FormularioUsuario;
