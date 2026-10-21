
import { Link } from 'react-router-dom';

function DetalleCliente() {
  const cliente = {
    nombre: 'Juan Pérez',
    telefono: '3171234567',
    correo: 'juan@ejemplo.com',
    direccion: 'La Huerta, Jalisco'
  };

  const vehiculos = [
    {
      id: 1,
      marca: 'Nissan',
      modelo: 'Versa',
      anio: 2020,
      placas: 'JAL123A',
      color: 'Blanco'
    },
    {
      id: 2,
      marca: 'Toyota',
      modelo: 'Hilux',
      anio: 2022,
      placas: 'JAL456B',
      color: 'Gris'
    }
  ];

  return (
    <div className="contenedor">
      <h1>Detalle del cliente</h1>

      <h3>Información personal</h3>

      <p><strong>Nombre:</strong> {cliente.nombre}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      <p><strong>Correo:</strong> {cliente.correo}</p>
      <p><strong>Dirección:</strong> {cliente.direccion}</p>

      <h3>Vehículos registrados</h3>

      <Link to="/vehiculos/nuevo" className="boton">
        Agregar vehículo
      </Link>

      <table>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Placas</th>
            <th>Color</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.anio}</td>
              <td>{vehiculo.placas}</td>
              <td>{vehiculo.color}</td>
              <td>
                <Link
                  to={`/vehiculos/editar/${vehiculo.id}`}
                  className="boton"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="acciones">
        <Link to="/clientes" className="boton boton-secundario">
          Volver a clientes
        </Link>
      </div>
    </div>
  );
}

export default DetalleCliente;
