
import {
  ClipboardList,
  Wrench,
  CircleCheck,
  CarFront,
  Package,
  Bell,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const indicadores = [
  { titulo: 'Órdenes registradas', icono: ClipboardList },
  { titulo: 'Servicios en proceso', icono: Wrench },
  { titulo: 'Servicios terminados', icono: CircleCheck },
  { titulo: 'Vehículos entregados', icono: CarFront }
];

const accesos = [
  {
    titulo: 'Órdenes de servicio',
    descripcion: 'Consultar los trabajos del taller',
    ruta: '/ordenes',
    icono: ClipboardList
  },
  {
    titulo: 'Solicitudes de piezas',
    descripcion: 'Consultar materiales solicitados',
    ruta: '/solicitudes',
    icono: Package
  },
  {
    titulo: 'Control de entregas',
    descripcion: 'Consultar vehículos listos para entregar',
    ruta: '/entregas',
    icono: CarFront
  },
  {
    titulo: 'Notificaciones',
    descripcion: 'Consultar los avisos operativos',
    ruta: '/notificaciones',
    icono: Bell
  }
];

function PanelPrincipal() {
  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>Panel principal</h1>
          <p>Resumen operativo de Llantas y Servicios La Huerta</p>
        </div>
        <LayoutDashboard size={28} color="#2563eb" />
      </div>

      <div className="estadisticas">
        {indicadores.map(({ titulo, icono: Icono }) => (
          <div className="tarjeta-estadistica" key={titulo}>
            <div>
              <p>{titulo}</p>
              <h2>0</h2>
            </div>
            <Icono size={24} />
          </div>
        ))}
      </div>

      <div className="tarjeta-tabla">
        <div className="tabla-encabezado">
          <div>
            <h3>Accesos rápidos</h3>
            <p>Secciones principales del sistema</p>
          </div>
        </div>

        <div className="panel-accesos">
          {accesos.map(({ titulo, descripcion, ruta, icono: Icono }) => (
            <Link className="panel-acceso" to={ruta} key={ruta}>
              <div className="panel-acceso-icono">
                <Icono size={23} />
              </div>
              <div className="panel-acceso-texto">
                <strong>{titulo}</strong>
                <p>{descripcion}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </div>

      <div className="tarjeta-tabla panel-actividad">
        <div className="tabla-encabezado">
          <div>
            <h3>Actividad reciente</h3>
            <p>Últimos movimientos de las órdenes de servicio</p>
          </div>
        </div>

        <div className="vista-vacia">
          <ClipboardList size={38} />
          <h4>No hay actividad registrada</h4>
          <p>Los movimientos aparecerán cuando el sistema tenga datos.</p>
        </div>
      </div>
    </div>
  );
}

export default PanelPrincipal;
