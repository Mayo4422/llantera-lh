
import { useState } from 'react';

import Modal from '../components/Modal';
import FormularioCliente from './FormularioCliente';

import {
  Users,
  CarFront,
  Search,
  Plus
} from 'lucide-react';

function Clientes() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="contenedor">

      {/* ENCABEZADO */}

      <div className="encabezado-pagina">
        <div>
          <h1>Clientes</h1>
          <p>Administración de clientes del sistema</p>
        </div>

        <button
          type="button"
          className="boton-nuevo"
          onClick={() => setMostrarModal(true)}
        >
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}

      <div className="estadisticas estadisticas-clientes">

        <div className="tarjeta-estadistica">
          <div>
            <p>Clientes totales</p>
            <h2>0</h2>
          </div>
          <Users size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Vehículos registrados</p>
            <h2>0</h2>
          </div>
          <CarFront size={24} />
        </div>

      </div>

      {/* TABLA DE CLIENTES */}

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Lista de clientes</h3>
            <p>Consulta y administración de clientes</p>
          </div>
        </div>

        {/* BUSCADOR */}

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              aria-label="Buscar cliente"
            />
          </div>
        </div>

        {/* TABLA */}

        <table className="tabla-clientes">
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
              <td colSpan={4}>
                <div className="clientes-vacios">
                  <Users size={36} />
                  <h4>No hay clientes registrados</h4>
                  <p>
                    Los clientes aparecerán aquí
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
        titulo="Nuevo cliente"
        descripcion="Ingresa los datos del nuevo cliente"
        onCerrar={() => setMostrarModal(false)}
      >
        <FormularioCliente />
      </Modal>

    </div>
  );
}

export default Clientes;
