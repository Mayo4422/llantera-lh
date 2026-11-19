export function Etiqueta({ texto, color = '#64748B' }) {
  return (
    <span
      className="etiqueta-estatus"
      style={{
        color,
        background: `${color}1A`,
        borderColor: `${color}55`
      }}
    >
      {texto}
    </span>
  );
}

export function Mensajes({ error, mensaje }) {
  return (
    <>
      {error && (
        <p role="alert" className="mensaje-error">
          {error}
        </p>
      )}
      {mensaje && (
        <p role="status" className="mensaje-exito">
          {mensaje}
        </p>
      )}
    </>
  );
}

export function FilaVacia({ columnas, icono: Icono, titulo, texto }) {
  return (
    <tr>
      <td colSpan={columnas}>
        <div className="tabla-sin-datos">
          {Icono && <Icono size={36} />}
          <h4>{titulo}</h4>
          {texto && <p>{texto}</p>}
        </div>
      </td>
    </tr>
  );
}

export function Tarjeta({ titulo, valor, icono: Icono }) {
  return (
    <div className="tarjeta-estadistica">
      <div>
        <p>{titulo}</p>
        <h2>{valor}</h2>
      </div>
      {Icono && <Icono size={24} />}
    </div>
  );
}
