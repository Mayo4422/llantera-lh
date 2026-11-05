
function Usuarios() {
  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de usuarios del sistema</p>
        </div>

        <button type="button">+ Nuevo usuario</button>
      </div>

      <div className="tarjeta-tabla">
        <h3>Lista de usuarios</h3>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="4" className="tabla-vacia">
                No hay usuarios registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;
