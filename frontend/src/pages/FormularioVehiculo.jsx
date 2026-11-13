
function FormularioVehiculo() {
  return (
    <>
      <div className="campo-formulario">
        <label htmlFor="vehiculo-cliente">
          Cliente
        </label>
        <select id="vehiculo-cliente" defaultValue="">
          <option value="" disabled>
            Seleccionar cliente
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="vehiculo-marca">
          Marca
        </label>
        <select id="vehiculo-marca" defaultValue="">
          <option value="" disabled>
            Seleccionar marca
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="vehiculo-modelo">
          Modelo
        </label>
        <select id="vehiculo-modelo" defaultValue="">
          <option value="" disabled>
            Seleccionar modelo
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="vehiculo-anio">
          Año
        </label>
        <input
          id="vehiculo-anio"
          type="number"
          placeholder="Año del vehículo"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="vehiculo-placa">
          Placa
        </label>
        <input
          id="vehiculo-placa"
          type="text"
          placeholder="Placa del vehículo"
        />
      </div>
    </>
  );
}

export default FormularioVehiculo;
