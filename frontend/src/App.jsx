
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation
} from 'react-router-dom';

import {
  Users,
  Shield,
  Contact,
  CarFront,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Clientes from './pages/Clientes';
import FormularioUsuario from './pages/FormularioUsuario';
import FormularioCliente from './pages/FormularioCliente';
import DetalleCliente from './pages/DetalleCliente';
import FormularioVehiculo from './pages/FormularioVehiculo';

import './App.css';

function Contenido() {
  const location = useLocation();
  const esLogin = location.pathname === '/';

  return (
    <div className={esLogin ? '' : 'sistema'}>

      {!esLogin && (
        <aside className="menu-lateral">

          <div className="menu-logo">
            <div className="logo-icono">LH</div>

            <div>
              <strong>Llantas y Servicios</strong>
              <small>La Huerta</small>
            </div>
          </div>

          <p className="menu-titulo">MENÚ PRINCIPAL</p>

          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              isActive ? 'menu-enlace activo' : 'menu-enlace'
            }
          >
            <Users size={18} />
            Usuarios
          </NavLink>

          <NavLink
            to="/roles"
            className={({ isActive }) =>
              isActive ? 'menu-enlace activo' : 'menu-enlace'
            }
          >
            <Shield size={18} />
            Roles
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              isActive ? 'menu-enlace activo' : 'menu-enlace'
            }
          >
            <Contact size={18} />
            Clientes
          </NavLink>

          <NavLink
            to="/vehiculos/nuevo"
            className={({ isActive }) =>
              isActive ? 'menu-enlace activo' : 'menu-enlace'
            }
          >
            <CarFront size={18} />
            Vehículos
          </NavLink>

          <div className="menu-inferior">
            <Link to="/" className="menu-enlace">
              <LogOut size={18} />
              Salir
            </Link>
          </div>

        </aside>
      )}

      <div className={esLogin ? '' : 'contenido-principal'}>

        {!esLogin && (
          <header className="barra-superior">

            <div className="buscador">
              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar clientes, usuarios..."
              />
            </div>

            <div className="barra-usuario">
              <Bell size={20} className="notificaciones" />

              <div className="usuario-avatar">AD</div>

              <div className="usuario-info">
                <strong>Administrador</strong>
                <small>Usuario del sistema</small>
              </div>
            </div>

          </header>
        )}

        <main className={esLogin ? 'main-login' : 'area-trabajo'}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/nuevo" element={<FormularioUsuario />} />
            <Route path="/usuarios/editar/:id" element={<FormularioUsuario />} />
            <Route path="/roles" element={<Roles />} />

            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<FormularioCliente />} />
            <Route path="/clientes/editar/:id" element={<FormularioCliente />} />
            <Route path="/clientes/:id" element={<DetalleCliente />} />

            <Route path="/vehiculos/nuevo" element={<FormularioVehiculo />} />
            <Route path="/vehiculos/editar/:id" element={<FormularioVehiculo />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Contenido />
    </BrowserRouter>
  );
}

export default App;
