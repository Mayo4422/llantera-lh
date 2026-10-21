
function Roles() {
  const roles = [
    { id: 1, nombre: 'Administrador', descripcion: 'Administración del sistema' },
    { id: 2, nombre: 'Mecánico', descripcion: 'Trabajos del taller' },
    { id: 3, nombre: 'Cajero', descripcion: 'Cobros y atención al cliente' }
  ];

  return (
    <div className="contenedor">
      <h1>Roles del sistema</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rol</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.id}</td>
              <td>{rol.nombre}</td>
              <td>{rol.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roles;
