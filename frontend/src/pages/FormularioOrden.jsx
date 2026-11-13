
function FormularioOrden() {
  return (
    <>

      <div className="campo-formulario">
        <label htmlFor="orden-cliente">
          Cliente
        </label>

        <select
          id="orden-cliente"
          defaultValue=""
        >
          <option value="" disabled>
            Seleccionar cliente
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="orden-vehiculo">
          Vehículo
        </label>

        <select
          id="orden-vehiculo"
          defaultValue=""
        >
          <option value="" disabled>
            Seleccionar vehículo
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="orden-servicio">
          Categoría de servicio
        </label>

        <select
          id="orden-servicio"
          defaultValue=""
        >
          <option value="" disabled>
            Seleccionar servicio
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="orden-descripcion">
          Descripción del trabajo
        </label>

        <textarea
          id="orden-descripcion"
          rows={4}
          placeholder="Describe el trabajo solicitado"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="orden-estado">
          Estado inicial
        </label>

        <select
          id="orden-estado"
          defaultValue="pendiente"
        >
          <option value="pendiente">
            Pendiente
          </option>

          <option value="proceso">
            En proceso
          </option>
        </select>
      </div>

    </>
  );
}

export default FormularioOrden;
