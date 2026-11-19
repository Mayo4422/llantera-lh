function FormularioCliente({ datos, onChange, tiposCliente = [] }) {
  const actualizarCampo = (event) => {
    const { name, value } = event.target;

    onChange({
      ...datos,
      [name]: name === 'telefono' ? value.replace(/\D/g, '').slice(0, 10) : value
    });
  };

  return (
    <>
      <div className="campo-formulario">
        <label htmlFor="cliente-nombre">Nombre completo</label>
        <input
          id="cliente-nombre"
          name="nombre_completo"
          type="text"
          placeholder="Nombre del cliente"
          value={datos.nombre_completo}
          onChange={actualizarCampo}
          required
          maxLength={120}
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-telefono">Teléfono (10 dígitos)</label>
        <input
          id="cliente-telefono"
          name="telefono"
          type="tel"
          inputMode="numeric"
          placeholder="3171234567"
          value={datos.telefono}
          onChange={actualizarCampo}
          required
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-correo">Correo electrónico (opcional)</label>
        <input
          id="cliente-correo"
          name="correo"
          type="email"
          placeholder="cliente@correo.com"
          value={datos.correo}
          onChange={actualizarCampo}
          maxLength={120}
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="cliente-tipo">Tipo de cliente</label>
        <select
          id="cliente-tipo"
          name="id_tipo_cliente"
          value={datos.id_tipo_cliente}
          onChange={actualizarCampo}
          required
        >
          <option value="">Selecciona un tipo</option>
          {tiposCliente.map((tipo) => (
            <option key={tipo.id_tipo_cliente} value={tipo.id_tipo_cliente}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default FormularioCliente;
