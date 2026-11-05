
function Clientes() {
  return (
    <div className="contenedor">

      <div className="encabezado-pagina">
        <div>
          <h1>Clientes</h1>
          <p>Administración de clientes del sistema</p>
        </div>

        <button type="button">
          + Nuevo cliente
        </button>
      </div>

      <div className="tarjeta-tabla">
        <h3>Lista de clientes</h3>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="4" className="tabla-vacia">
                No hay clientes registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Clientes;
