
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation
} from 'react-router-dom';

import {
  Users,
  Shield,
  Contact,
  CarFront,
  ClipboardList,
  Package,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import DetalleCliente from './pages/DetalleCliente';
import OrdenesServicio from './pages/OrdenesServicio';
import SolicitudesPiezas from './pages/SolicitudesPiezas';
import ControlEntregas from './pages/ControlEntregas';
import NoEncontrado from './pages/NoEncontrado';

import './App.css';

function EstructuraSistema() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Login />;
  }

  const enlaces = [
    {
      ruta: '/usuarios',
      nombre: 'Usuarios',
      icono: Users
    },
    {
      ruta: '/roles',
      nombre: 'Roles',
      icono: Shield
    },
    {
      ruta: '/clientes',
      nombre: 'Clientes',
      icono: Contact
    },
    {
      ruta: '/vehiculos',
      nombre: 'Vehículos',
      icono: CarFront
    },
    {
      ruta: '/ordenes',
      nombre: 'Órdenes de servicio',
      icono: ClipboardList
    },
    {
      ruta: '/solicitudes',
      nombre: 'Solicitudes de piezas',
      icono: Package
    },
    {
      ruta: '/entregas',
      nombre: 'Control de entregas',
      icono: CarFront
    }
  ];

  return (
    <div className="sistema">

      {/* MENÚ LATERAL */}

      <aside className="menu-lateral">

        <div className="menu-logo">
          <div className="logo-icono">
            LH
          </div>

          <div>
            <strong>Llantas y Servicios</strong>
            <small>La Huerta</small>
          </div>
        </div>

        <p className="menu-titulo">
          MENÚ PRINCIPAL
        </p>

        <nav>
          {enlaces.map((enlace) => {
            const Icono = enlace.icono;

            return (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                className={({ isActive }) =>
                  isActive
                    ? 'menu-enlace activo'
                    : 'menu-enlace'
                }
              >
                <Icono size={18} />
                <span>{enlace.nombre}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="menu-inferior">
          <NavLink
            to="/"
            className="menu-enlace"
          >
            <LogOut size={18} />
            <span>Salir</span>
          </NavLink>
        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}

      <div className="contenido-principal">

        <header className="barra-superior">

          <div className="buscador">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar en el sistema..."
              aria-label="Buscar en el sistema"
            />
          </div>

          <div className="barra-usuario">

            <Bell size={20} />

            <div className="usuario-avatar">
              AD
            </div>

            <div className="usuario-info">
              <strong>Administrador</strong>
              <small>Administrador</small>
            </div>

          </div>

        </header>

        {/* RUTAS */}

        <main className="area-trabajo">

          <Routes>

            <Route
              path="/usuarios"
              element={<Usuarios />}
            />

            <Route
              path="/roles"
              element={<Roles />}
            />

            <Route
              path="/clientes"
              element={<Clientes />}
            />

            <Route
              path="/clientes/:id"
              element={<DetalleCliente />}
            />

            <Route
              path="/vehiculos"
              element={<Vehiculos />}
            />

            <Route
              path="/ordenes"
              element={<OrdenesServicio />}
            />

            <Route
              path="/solicitudes"
              element={<SolicitudesPiezas />}
            />

            <Route
              path="/entregas"
              element={<ControlEntregas />}
            />

            <Route
              path="*"
              element={<NoEncontrado />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <EstructuraSistema />
    </BrowserRouter>
  );
}

export default App;
