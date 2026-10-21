
import { Link, useParams } from 'react-router-dom';

function FormularioVehiculo() {
  const { id } = useParams();

  return (
    <div className="contenedor">
      <h1>{id ? 'Editar vehículo' : 'Registrar vehículo'}</h1>

      <form className="formulario">
        <label>Marca</label>
        <select defaultValue="">
          <option value="">Seleccionar marca</option>
          <option>Nissan</option>
          <option>Toyota</option>
          <option>Chevrolet</option>
          <option>Ford</option>
          <option>Volkswagen</option>
        </select>

        <label>Modelo</label>
        <input
          type="text"
          placeholder="Modelo del vehículo"
        />

        <label>Año</label>
        <input
          type="number"
          placeholder="Año del vehículo"
        />

        <label>Placas</label>
        <input
          type="text"
          placeholder="Número de placas"
        />

        <label>Color</label>
        <input
          type="text"
          placeholder="Color del vehículo"
        />

        <label>Cliente</label>
        <select defaultValue="">
          <option value="">Seleccionar cliente</option>
          <option>Juan Pérez</option>
          <option>María López</option>
          <option>Carlos García</option>
        </select>

        <div className="acciones">
          <button type="button">Guardar</button>

          <Link to="/clientes" className="boton boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FormularioVehiculo;
