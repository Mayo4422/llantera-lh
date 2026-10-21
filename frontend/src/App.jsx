
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import FormularioUsuario from './pages/FormularioUsuario';
import Roles from './pages/Roles';

import Clientes from './pages/Clientes';
import FormularioCliente from './pages/FormularioCliente';
import DetalleCliente from './pages/DetalleCliente';
import FormularioVehiculo from './pages/FormularioVehiculo';

import './App.css';

function Contenido() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && (
        <nav>
          <h3>Llantas y Servicios La Huerta</h3>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/clientes">Clientes</Link>
          <Link to="/">Salir</Link>
        </nav>
      )}

      <main className={location.pathname === '/' ? 'main-login' : ''}>
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
    </>
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
