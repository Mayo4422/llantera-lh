
import { useState } from 'react';

import Modal from '../components/Modal';
import FormularioVehiculo from './FormularioVehiculo';

import {
  CarFront,
  Users,
  Search,
  Plus
} from 'lucide-react';

function Vehiculos() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="contenedor">

      {/* ENCABEZADO */}

      <div className="encabezado-pagina">
        <div>
          <h1>Vehículos</h1>
          <p>Administración de vehículos de clientes</p>
        </div>

        <button
          type="button"
          className="boton-nuevo"
          onClick={() => setMostrarModal(true)}
        >
          <Plus size={18} />
          Nuevo vehículo
        </button>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}

      <div className="estadisticas estadisticas-vehiculos">

        <div className="tarjeta-estadistica">
          <div>
            <p>Vehículos registrados</p>
            <h2>0</h2>
          </div>
          <CarFront size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Clientes con vehículos</p>
            <h2>0</h2>
          </div>
          <Users size={24} />
        </div>

      </div>

      {/* TABLA DE VEHÍCULOS */}

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Lista de vehículos</h3>
            <p>Consulta de vehículos registrados</p>
          </div>
        </div>

        {/* BUSCADOR */}

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar vehículo..."
              aria-label="Buscar vehículo"
            />
          </div>
        </div>

        {/* TABLA */}

        <table className="tabla-vehiculos">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Placa</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="vehiculos-vacios">
                  <CarFront size={36} />
                  <h4>No hay vehículos registrados</h4>
                  <p>
                    Los vehículos aparecerán aquí
                    cuando se registren.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      {/* FORMULARIO EMERGENTE REUTILIZABLE */}

      <Modal
        abierto={mostrarModal}
        titulo="Nuevo vehículo"
        descripcion="Ingresa los datos del vehículo"
        onCerrar={() => setMostrarModal(false)}
      >
        <FormularioVehiculo />
      </Modal>

    </div>
  );
}

export default Vehiculos;
