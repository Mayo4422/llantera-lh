
import { Link } from 'react-router-dom';

function Usuarios() {
  const usuarios = [
    { id: 1, nombre: 'Juan Pérez', usuario: 'juan', rol: 'Administrador' },
    { id: 2, nombre: 'Pedro López', usuario: 'pedro', rol: 'Mecánico' },
    { id: 3, nombre: 'Ana García', usuario: 'ana', rol: 'Cajero' }
  ];

  return (
    <div className="contenedor">
      <h1>Lista de usuarios</h1>

      <Link to="/usuarios/nuevo" className="boton">
        Nuevo usuario
      </Link>

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
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.rol}</td>
              <td>
                <Link
                  to={`/usuarios/editar/${usuario.id}`}
                  className="boton"
                >
                  Editar
                </Link>

                <button type="button" className="boton-secundario">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
