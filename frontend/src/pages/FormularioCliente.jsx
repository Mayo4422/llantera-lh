
function FormularioCliente() {
  return (
    <>
      <div className="campo-formulario">
        <label htmlFor="cliente-nombre">
          Nombre completo
        </label>
        <input
          id="cliente-nombre"
          type="text"
          placeholder="Nombre del cliente"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-telefono">
          Teléfono
        </label>
        <input
          id="cliente-telefono"
          type="tel"
          placeholder="Número de teléfono"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-correo">
          Correo electrónico
        </label>
        <input
          id="cliente-correo"
          type="email"
          placeholder="Correo electrónico"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-direccion">
          Dirección
        </label>
        <input
          id="cliente-direccion"
          type="text"
          placeholder="Dirección del cliente"
        />
      </div>
    </>
  );
}

export default FormularioCliente;
