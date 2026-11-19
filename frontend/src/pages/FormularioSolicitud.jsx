function FormularioSolicitud() {
  return (
    <>

      <div className="campo-formulario">
        <label htmlFor="solicitud-orden">
          Orden de servicio
        </label>

        <select
          id="solicitud-orden"
          defaultValue=""
        >
          <option value="" disabled>
            Seleccionar orden de servicio
          </option>
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="solicitud-pieza">
          Pieza o material solicitado
        </label>

        <input
          id="solicitud-pieza"
          type="text"
          placeholder="Nombre de la pieza o material"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="solicitud-cantidad">
          Cantidad
        </label>

        <input
          id="solicitud-cantidad"
          type="number"
          min="1"
          placeholder="Cantidad solicitada"
        />
      </div>

      <div className="campo-formulario">
        <label htmlFor="solicitud-observaciones">
          Observaciones
        </label>

        <textarea
          id="solicitud-observaciones"
          rows={4}
          placeholder="Agrega información adicional"
        />
      </div>

    </>
  );
}

export default FormularioSolicitud;
