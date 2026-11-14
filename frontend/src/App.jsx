
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  Shield,
  Contact,
  CarFront,
  ClipboardList,
  Package,
  History,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

import {
  AuthProvider,
  useAuth
} from './context/AuthContext';
import CambiarContrasena from './pages/CambiarContrasena';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Clientes from './pages/Clientes';
import Vehiculos from './pages/Vehiculos';
import DetalleCliente from './pages/DetalleCliente';
import OrdenesServicio from './pages/OrdenesServicio';
import SolicitudesPiezas from './pages/SolicitudesPiezas';
import ControlEntregas from './pages/ControlEntregas';
import PanelPrincipal from './pages/PanelPrincipal';
import Notificaciones from './pages/Notificaciones';
import HistorialOrdenes from './pages/HistorialOrdenes';
import NoEncontrado from './pages/NoEncontrado';

import './App.css';

const gruposMenu = [
  {
    titulo: 'GENERAL',
    enlaces: [
      {
        ruta: '/panel',
        nombre: 'Panel principal',
        icono: LayoutDashboard
      }
    ]
  },
  {
    titulo: 'ADMINISTRACIÓN',
    enlaces: [
      {
        ruta: '/usuarios',
        nombre: 'Usuarios',
        icono: Users,
        roles: ['Administrador']
      },
      {
        ruta: '/roles',
        nombre: 'Roles',
        icono: Shield,
        roles: ['Administrador']
      },
      {
        ruta: '/clientes',
        nombre: 'Clientes',
        icono: Contact,
        roles: ['Administrador', 'Cajero']
      },
      {
        ruta: '/vehiculos',
        nombre: 'Vehículos',
        icono: CarFront,
        roles: ['Administrador', 'Cajero']
      }
    ]
  },
  {
    titulo: 'OPERACIONES',
    enlaces: [
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
        icono: CarFront,
        roles: ['Administrador', 'Cajero']
      }
    ]
  },
  {
    titulo: 'SEGUIMIENTO',
    enlaces: [
      {
        ruta: '/historial',
        nombre: 'Historial de órdenes',
        icono: History
      },
      {
        ruta: '/notificaciones',
        nombre: 'Notificaciones',
        icono: Bell
      }
    ]
  }
];


function RutaProtegida({ children, roles }) {
  const { autenticado, usuario } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  const requiereCambio =
    Boolean(usuario?.debe_cambiar_contrasena);

  if (
    requiereCambio &&
    location.pathname !== '/cambiar-contrasena'
  ) {
    return (
      <Navigate
        to="/cambiar-contrasena"
        replace
      />
    );
  }

  if (
    !requiereCambio &&
    location.pathname === '/cambiar-contrasena'
  ) {
    return <Navigate to="/panel" replace />;
  }

  if (roles && !roles.includes(usuario?.rol)) {
    return <Navigate to="/panel" replace />;
  }

  return children;
}


function EstructuraSistema() {
  const {
    autenticado,
    usuario,
    cerrarSesion
  } = useAuth();

  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/', { replace: true });
  };

  const enlacesPermitidos = (enlaces) =>
    enlaces.filter(
      (enlace) =>
        !enlace.roles ||
        enlace.roles.includes(usuario?.rol)
    );

  const iniciales = usuario?.nombre_completo
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase() || 'US';

  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
      <Route
        path="/cambiar-contrasena"
        element={
          <RutaProtegida>
            <CambiarContrasena />
          </RutaProtegida>
        }
      />
      <Route
        path="/*"
        element={
          <RutaProtegida>
            <div className="sistema">
              <aside className="menu-lateral">
                <div className="menu-logo">
                  <div className="logo-icono">LH</div>

                  <div>
                    <strong>Llantas y Servicios</strong>
                    <small>La Huerta</small>
                  </div>
                </div>

                <nav aria-label="Menú principal">
                  {gruposMenu.map((grupo) => {
                    const enlaces = enlacesPermitidos(
                      grupo.enlaces
                    );

                    if (enlaces.length === 0) {
                      return null;
                    }

                    return (
                      <div
                        className="grupo-menu"
                        key={grupo.titulo}
                      >
                        <p className="menu-titulo">
                          {grupo.titulo}
                        </p>

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
                              <span>
                                {enlace.nombre}
                              </span>
                            </NavLink>
                          );
                        })}
                      </div>
                    );
                  })}
                </nav>

                <div className="menu-inferior">
                  <button
                    type="button"
                    className="menu-enlace"
                    onClick={salir}
                    style={{
                      width: '100%',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      font: 'inherit'
                    }}
                  >
                    <LogOut size={18} />
                    <span>Salir</span>
                  </button>
                </div>
              </aside>

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
                    <NavLink
                      to="/notificaciones"
                      className="enlace-notificaciones"
                      aria-label="Ver notificaciones"
                      title="Notificaciones"
                    >
                      <Bell size={20} />
                    </NavLink>

                    <div className="usuario-avatar">
                      {iniciales}
                    </div>

                    <div className="usuario-info">
                      <strong>
                        {usuario?.nombre_completo}
                      </strong>
                      <small>
                        {usuario?.rol}
                      </small>
                    </div>
                  </div>
                </header>

                <main className="area-trabajo">
                  <Routes>
                    <Route
                      path="/panel"
                      element={<PanelPrincipal />}
                    />

                    <Route
                      path="/usuarios"
                      element={
                        <RutaProtegida
                          roles={['Administrador']}
                        >
                          <Usuarios />
                        </RutaProtegida>
                      }
                    />

                    <Route
                      path="/roles"
                      element={
                        <RutaProtegida
                          roles={['Administrador']}
                        >
                          <Roles />
                        </RutaProtegida>
                      }
                    />

                    <Route
                      path="/clientes"
                      element={
                        <RutaProtegida
                          roles={['Administrador', 'Cajero']}
                        >
                          <Clientes />
                        </RutaProtegida>
                      }
                    />

                    <Route
                      path="/clientes/:id"
                      element={
                        <RutaProtegida
                          roles={['Administrador', 'Cajero']}
                        >
                          <DetalleCliente />
                        </RutaProtegida>
                      }
                    />

                    <Route
                      path="/vehiculos"
                      element={
                        <RutaProtegida
                          roles={['Administrador', 'Cajero']}
                        >
                          <Vehiculos />
                        </RutaProtegida>
                      }
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
                      element={
                        <RutaProtegida
                          roles={['Administrador', 'Cajero']}
                        >
                          <ControlEntregas />
                        </RutaProtegida>
                      }
                    />

                    <Route
                      path="/historial"
                      element={<HistorialOrdenes />}
                    />

                    <Route
                      path="/notificaciones"
                      element={<Notificaciones />}
                    />

                    <Route
                      path="*"
                      element={<NoEncontrado />}
                    />
                  </Routes>
                </main>
              </div>
            </div>
          </RutaProtegida>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EstructuraSistema />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
