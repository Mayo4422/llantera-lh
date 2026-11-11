
import { useState } from 'react';

import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Plus,
  Filter,
  X,
  Save
} from 'lucide-react';

function Usuarios() {

  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="contenedor">

      <div className="encabezado-pagina">
        <div>
          <h1>Usuarios</h1>
          <p>Personal del sistema y control de accesos</p>
        </div>

        <button
          type="button"
          className="boton-nuevo"
          onClick={() => setMostrarModal(true)}
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}

      <div className="estadisticas">

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios totales</p>
            <h2>0</h2>
          </div>
          <Users size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios activos</p>
            <h2>0</h2>
          </div>
          <UserCheck size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Administradores</p>
            <h2>0</h2>
          </div>
          <Shield size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios inactivos</p>
            <h2>0</h2>
          </div>
          <UserX size={24} />
        </div>

      </div>

      {/* TABLA DE USUARIOS */}

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Lista de usuarios</h3>
            <p>Consulta y administración del personal</p>
          </div>
        </div>

        <div className="tabla-filtros">

          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar usuario..."
            />
          </div>

          <div className="filtro-rol">
            <Filter size={18} />
            <select defaultValue="todos">
              <option value="todos">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="mecanico">Mecánico</option>
              <option value="cajero">Cajero</option>
            </select>
          </div>

        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={5}>
                <div className="usuarios-vacios">
                  <Users size={36} />
                  <h4>No hay usuarios registrados</h4>
                  <p>
                    Los usuarios aparecerán aquí
                    cuando se registren.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      {/* VENTANA EMERGENTE */}

      {mostrarModal && (

        <div className="modal-fondo">

          <div
            className="modal-contenido"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-usuario"
          >

            <div className="modal-encabezado">
              <div>
                <h2 id="titulo-modal-usuario">Nuevo usuario</h2>
                <p>Ingresa los datos del nuevo usuario</p>
              </div>

              <button
                type="button"
                className="modal-cerrar"
                aria-label="Cerrar formulario"
                onClick={() => setMostrarModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-cuerpo">

              <div className="campo-formulario">
                <label htmlFor="nombre-usuario">
                  Nombre completo
                </label>
                <input
                  id="nombre-usuario"
                  type="text"
                  placeholder="Nombre del empleado"
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="usuario-login">
                  Nombre de usuario
                </label>
                <input
                  id="usuario-login"
                  type="text"
                  placeholder="Usuario para iniciar sesión"
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="contrasena-usuario">
                  Contraseña
                </label>
                <input
                  id="contrasena-usuario"
                  type="password"
                  placeholder="Ingresa una contraseña"
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="rol-usuario">
                  Rol
                </label>
                <select id="rol-usuario" defaultValue="">
                  <option value="" disabled>
                    Seleccionar rol
                  </option>
                  <option value="administrador">
                    Administrador
                  </option>
                  <option value="mecanico">
                    Mecánico
                  </option>
                  <option value="cajero">
                    Cajero
                  </option>
                </select>
              </div>

            </div>

            <div className="modal-pie">

              <button
                type="button"
                className="boton-cancelar"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="boton-guardar"
                onClick={() => setMostrarModal(false)}
              >
                <Save size={17} />
                Guardar usuario
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Usuarios;
