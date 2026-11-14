
import { useState } from 'react';
import {
  History,
  ClipboardList,
  Activity,
  UserRound,
  Search
} from 'lucide-react';

function HistorialOrdenes() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>Historial de órdenes</h1>
          <p>Seguimiento de los cambios de estado de los servicios</p>
        </div>
      </div>

      <div className="estadisticas">
        <div className="tarjeta-estadistica">
          <div>
            <p>Movimientos registrados</p>
            <h2>0</h2>
          </div>
          <History size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Órdenes con historial</p>
            <h2>0</h2>
          </div>
          <ClipboardList size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Cambios de hoy</p>
            <h2>0</h2>
          </div>
          <Activity size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios participantes</p>
            <h2>0</h2>
          </div>
          <UserRound size={24} />
        </div>
      </div>

      <div className="tarjeta-tabla">
        <div className="tabla-encabezado">
          <div>
            <h3>Registro de movimientos</h3>
            <p>Historial de cambios realizados en las órdenes</p>
          </div>
        </div>

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por orden o usuario..."
              aria-label="Buscar historial"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="tabla-responsive">
          <table className="tabla-modulo">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Estado anterior</th>
                <th>Estado nuevo</th>
                <th>Usuario responsable</th>
                <th>Fecha y hora</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="vista-vacia">
                    <History size={38} />
                    <h4>No hay movimientos registrados</h4>
                    <p>
                      Aquí se mostrarán los cambios de estado
                      realizados durante la atención de las órdenes.
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

export default HistorialOrdenes;
