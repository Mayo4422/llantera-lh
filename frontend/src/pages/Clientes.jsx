
import { Link } from 'react-router-dom';

function Clientes() {
  const clientes = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      telefono: '3171234567',
      correo: 'juan@ejemplo.com'
    },
    {
      id: 2,
      nombre: 'María López',
      telefono: '3179876543',
      correo: 'maria@ejemplo.com'
    },
    {
      id: 3,
      nombre: 'Carlos García',
      telefono: '3174567890',
      correo: 'carlos@ejemplo.com'
    }
  ];

  return (
    <div className="contenedor">
      <h1>Lista de clientes</h1>

      <Link to="/clientes/nuevo" className="boton">
        Nuevo cliente
      </Link>

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
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.correo}</td>
              <td>
                <Link
                  to={`/clientes/${cliente.id}`}
                  className="boton"
                >
                  Ver
                </Link>

                <Link
                  to={`/clientes/editar/${cliente.id}`}
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

export default Clientes;
