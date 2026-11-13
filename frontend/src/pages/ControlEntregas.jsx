
import { useState } from 'react';

import {
  CarFront,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ClipboardList,
  Search,
  Info
} from 'lucide-react';

function ControlEntregas() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  return (
    <div className="contenedor">

      {/* ENCABEZADO */}

      <div className="encabezado-pagina">
        <div>
          <h1>Control de entregas</h1>
          <p>
            Seguimiento de vehículos listos
            para entregar y entregados
          </p>
        </div>
      </div>

      {/* ESTADÍSTICAS */}

      <div className="estadisticas">

        <div className="tarjeta-estadistica">
          <div>
            <p>Listos para entrega</p>
            <h2>0</h2>
          </div>
          <Clock size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Vehículos entregados</p>
            <h2>0</h2>
          </div>
          <CheckCircle2 size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Entregas de hoy</p>
            <h2>0</h2>
          </div>
          <CalendarCheck size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Total de órdenes</p>
            <h2>0</h2>
          </div>
          <ClipboardList size={24} />
        </div>

      </div>

      {/* INFORMACIÓN OPERATIVA */}

      <div className="entregas-aviso">
        <Info size={20} />

        <div>
          <strong>Proceso de entrega</strong>
          <p>
            Cuando el mecánico termine el servicio,
            el cajero recibirá una notificación.
            Después de entregar el vehículo,
            podrá confirmar la entrega en el sistema.
          </p>
        </div>
      </div>

      {/* TABLA */}

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Registro de entregas</h3>
            <p>
              Consulta de órdenes terminadas
              y vehículos entregados
            </p>
          </div>
        </div>

        {/* FILTROS */}

        <div className="tabla-filtros">

          <div className="filtro-busqueda">
            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar por orden, cliente o vehículo..."
              aria-label="Buscar entrega"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filtro-rol">
            <select
              aria-label="Filtrar entregas"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">
                Todos los estados
              </option>

              <option value="listo">
                Listo para entrega
              </option>

              <option value="entregado">
                Entregado
              </option>
            </select>
          </div>

        </div>

        {/* REGISTROS */}

        <div className="tabla-responsive">

          <table className="tabla-entregas">

            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha de finalización</th>
                <th>Estado</th>
                <th>Fecha de entrega</th>
                <th>Entregado por</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={8}>

                  <div className="entregas-vacias">

                    <CarFront size={38} />

                    <h4>
                      No hay entregas registradas
                    </h4>

                    <p>
                      Las órdenes terminadas y las
                      entregas aparecerán aquí cuando
                      estén disponibles.
                    </p>

                  </div>

                </td>
              </tr>
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ControlEntregas;
