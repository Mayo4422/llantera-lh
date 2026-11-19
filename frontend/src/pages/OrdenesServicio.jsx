import { useState } from 'react';

import {
  ClipboardList,
  Wrench,
  CircleCheck,
  Clock,
  Search,
  Plus
} from 'lucide-react';

import Modal from '../components/Modal';
import FormularioOrden from './FormularioOrden';

function OrdenesServicio() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <div className="contenedor">

      <div className="encabezado-pagina">
        <div>
          <h1>Órdenes de servicio</h1>
          <p>
            Administración y seguimiento de trabajos
          </p>
        </div>

        <button
          type="button"
          className="boton-nuevo"
          onClick={() => setMostrarModal(true)}
        >
          <Plus size={18} />
          Nueva orden
        </button>
      </div>

      <div className="estadisticas">

        <div className="tarjeta-estadistica">
          <div>
            <p>Órdenes totales</p>
            <h2>0</h2>
          </div>
          <ClipboardList size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>En proceso</p>
            <h2>0</h2>
          </div>
          <Wrench size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Finalizadas</p>
            <h2>0</h2>
          </div>
          <CircleCheck size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Pendientes</p>
            <h2>0</h2>
          </div>
          <Clock size={24} />
        </div>

      </div>

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Lista de órdenes</h3>
            <p>
              Consulta y seguimiento de órdenes
            </p>
          </div>
        </div>

        <div className="tabla-filtros">

          <div className="filtro-busqueda">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar orden..."
              aria-label="Buscar orden"
            />
          </div>

          <div className="filtro-rol">
            <select defaultValue="todos">
              <option value="todos">
                Todos los estados
              </option>
              <option value="pendiente">
                Pendiente
              </option>
              <option value="proceso">
                En proceso
              </option>
              <option value="finalizada">
                Finalizada
              </option>
            </select>
          </div>

        </div>

        <div className="tabla-responsive">
          <table className="tabla-ordenes">

            <thead>
              <tr>
                <th>Folio</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={7}>
                  <div className="ordenes-vacias">

                    <ClipboardList size={36} />

                    <h4>
                      No hay órdenes registradas
                    </h4>

                    <p>
                      Las órdenes aparecerán aquí
                      cuando se registren.
                    </p>

                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

      </div>

      <Modal
        abierto={mostrarModal}
        titulo="Nueva orden de servicio"
        descripcion="Ingresa los datos de la orden"
        onCerrar={cerrarModal}
      >
        <FormularioOrden />
      </Modal>

    </div>
  );
}

export default OrdenesServicio;
