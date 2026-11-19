import { useCallback, useEffect, useMemo, useState } from 'react';

import Modal from '../components/Modal';
import FormularioUsuario from './FormularioUsuario';
import { useAuth } from '../context/AuthContext';
import { usuariosService } from '../services/usuarios.service';

import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Plus,
  Filter,
  Pencil,
  KeyRound,
  RefreshCw
} from 'lucide-react';

const FORMULARIO_INICIAL = {
  nombre_completo: '',
  usuario: '',
  contrasena: '',
  id_rol: ''
};

const NOMBRES_ROLES = {
  1: 'Mecánico',
  2: 'Cajero',
  3: 'Administrador'
};

function estaActivo(usuario) {
  return Number(usuario.activo) === 1;
}

function obtenerRol(usuario) {
  return (
    usuario.rol ||
    usuario.nombre_rol ||
    NOMBRES_ROLES[Number(usuario.id_rol)] ||
    'Sin rol'
  );
}

function Usuarios() {
  const { token, usuario: usuarioActual } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_INICIAL
  });

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError('');

    try {
      const datos = await usuariosService.listar(token);

      const lista = Array.isArray(datos.usuarios)
        ? datos.usuarios
        : Array.isArray(datos.datos)
          ? datos.datos
          : Array.isArray(datos.data)
            ? datos.data
            : null;

      if (!lista) {
        throw new Error(
          'La API no devolvió una lista de usuarios válida'
        );
      }

      setUsuarios(lista);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      cargarUsuarios();
    }
  }, [token, cargarUsuarios]);

  const estadisticas = useMemo(() => {
    return {
      total: usuarios.length,
      activos: usuarios.filter(estaActivo).length,
      administradores: usuarios.filter(
        (u) => obtenerRol(u) === 'Administrador'
      ).length,
      inactivos: usuarios.filter(
        (u) => !estaActivo(u)
      ).length
    };
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return usuarios.filter((u) => {
      const coincideTexto =
        String(u.nombre_completo || '')
          .toLowerCase()
          .includes(texto) ||
        String(u.usuario || '')
          .toLowerCase()
          .includes(texto);

      const coincideRol =
        filtroRol === 'todos' ||
        obtenerRol(u).toLowerCase() === filtroRol;

      return coincideTexto && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  function abrirNuevo() {
    setUsuarioEditando(null);
    setFormulario({ ...FORMULARIO_INICIAL });
    setErrorFormulario('');
    setMostrarModal(true);
  }

  function abrirEditar(usuario) {
    setUsuarioEditando(usuario);

    setFormulario({
      nombre_completo: usuario.nombre_completo || '',
      usuario: usuario.usuario || '',
      contrasena: '',
      id_rol: String(usuario.id_rol || '')
    });

    setErrorFormulario('');
    setMostrarModal(true);
  }

  function cerrarModal() {
    if (guardando) return;

    setMostrarModal(false);
    setUsuarioEditando(null);
    setErrorFormulario('');
  }

  async function guardarUsuario() {
    setErrorFormulario('');

    const nombre = formulario.nombre_completo.trim();
    const nombreUsuario = formulario.usuario.trim();
    const idRol = Number(formulario.id_rol);

    if (nombre.length < 3 || nombre.length > 100) {
      setErrorFormulario(
        'El nombre debe tener entre 3 y 100 caracteres'
      );
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(nombreUsuario)) {
      setErrorFormulario(
        'El usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos, guiones o guiones bajos'
      );
      return;
    }

    if (![1, 2, 3].includes(idRol)) {
      setErrorFormulario('Selecciona un rol válido');
      return;
    }

    if (!usuarioEditando) {
      const bytes = new TextEncoder().encode(
        formulario.contrasena
      ).length;

      if (
        formulario.contrasena.length < 12 ||
        bytes > 72
      ) {
        setErrorFormulario(
          'La contraseña debe tener al menos 12 caracteres y no superar 72 bytes'
        );
        return;
      }
    }

    const datosUsuario = {
      nombre_completo: nombre,
      usuario: nombreUsuario,
      id_rol: idRol
    };

    setGuardando(true);

    try {
      if (usuarioEditando) {
        await usuariosService.actualizar(
          usuarioEditando.id_usuario,
          datosUsuario,
          token
        );

        setMensaje('Usuario actualizado correctamente');
      } else {
        await usuariosService.crear(
          {
            ...datosUsuario,
            contrasena: formulario.contrasena
          },
          token
        );

        setMensaje('Usuario creado correctamente');
      }

      setMostrarModal(false);
      setUsuarioEditando(null);
      setFormulario({ ...FORMULARIO_INICIAL });

      await cargarUsuarios();
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(usuario) {
    const activoActual = estaActivo(usuario);

    if (
      Number(usuario.id_usuario) ===
      Number(usuarioActual?.id_usuario)
    ) {
      setError('No puedes desactivar tu propia cuenta');
      return;
    }

    const accion = activoActual ? 'desactivar' : 'activar';

    if (
      !window.confirm(
        `¿Deseas ${accion} a ${usuario.nombre_completo}?`
      )
    ) {
      return;
    }

    setError('');
    setMensaje('');

    try {
      await usuariosService.cambiarEstado(
        usuario.id_usuario,
        activoActual ? 0 : 1,
        token
      );

      setMensaje(
        `Usuario ${activoActual ? 'desactivado' : 'activado'} correctamente`
      );

      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  async function restablecerContrasena(usuario) {
    if (
      Number(usuario.id_usuario) ===
      Number(usuarioActual?.id_usuario)
    ) {
      setError(
        'Para cambiar tu propia contraseña utiliza tu perfil'
      );
      return;
    }

    const nuevaContrasena = window.prompt(
      `Escribe una contraseña temporal para ${usuario.nombre_completo}.\nMínimo 12 caracteres.`
    );

    if (nuevaContrasena === null) return;

    const bytes = new TextEncoder().encode(
      nuevaContrasena
    ).length;

    if (
      nuevaContrasena.length < 12 ||
      bytes > 72
    ) {
      setError(
        'La contraseña debe tener al menos 12 caracteres y no superar 72 bytes'
      );
      return;
    }

    if (
      !window.confirm(
        `¿Confirmas el restablecimiento de contraseña de ${usuario.nombre_completo}?`
      )
    ) {
      return;
    }

    setError('');
    setMensaje('');

    try {
      await usuariosService.restablecerContrasena(
        usuario.id_usuario,
        nuevaContrasena,
        token
      );

      setMensaje(
        'Contraseña restablecida. El usuario deberá cambiarla al iniciar sesión.'
      );

      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

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
          onClick={abrirNuevo}
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      <div className="estadisticas">
        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios totales</p>
            <h2>{estadisticas.total}</h2>
          </div>
          <Users size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios activos</p>
            <h2>{estadisticas.activos}</h2>
          </div>
          <UserCheck size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Administradores</p>
            <h2>{estadisticas.administradores}</h2>
          </div>
          <Shield size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios inactivos</p>
            <h2>{estadisticas.inactivos}</h2>
          </div>
          <UserX size={24} />
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: '#dc2626' }}>
          {error}
        </p>
      )}

      {mensaje && (
        <p role="status" style={{ color: '#15803d' }}>
          {mensaje}
        </p>
      )}

      <div className="tarjeta-tabla">
        <div className="tabla-encabezado">
          <div>
            <h3>Lista de usuarios</h3>
            <p>Consulta y administración del personal</p>
          </div>

          <button
            type="button"
            onClick={cargarUsuarios}
            disabled={cargando}
            title="Actualizar lista"
            aria-label="Actualizar lista de usuarios"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="filtro-rol">
            <Filter size={18} />

            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="todos">
                Todos los roles
              </option>
              <option value="administrador">
                Administrador
              </option>
              <option value="mecánico">
                Mecánico
              </option>
              <option value="cajero">
                Cajero
              </option>
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
            {cargando ? (
              <tr>
                <td colSpan={5}>
                  Cargando usuarios...
                </td>
              </tr>
            ) : usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="usuarios-vacios">
                    <Users size={36} />
                    <h4>No se encontraron usuarios</h4>
                    <p>
                      No hay registros que coincidan con
                      los filtros seleccionados.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => {
                const activo = estaActivo(usuario);

                const esMiCuenta =
                  Number(usuario.id_usuario) ===
                  Number(usuarioActual?.id_usuario);

                return (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.nombre_completo}</td>
                    <td>{usuario.usuario}</td>
                    <td>{obtenerRol(usuario)}</td>

                    <td>
                      <span>
                        {activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <button
                          type="button"
                          title="Editar usuario"
                          onClick={() => abrirEditar(usuario)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Restablecer contraseña"
                          disabled={esMiCuenta}
                          onClick={() =>
                            restablecerContrasena(usuario)
                          }
                        >
                          <KeyRound size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={esMiCuenta}
                          onClick={() => cambiarEstado(usuario)}
                        >
                          {activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        abierto={mostrarModal}
        titulo={
          usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'
        }
        descripcion={
          usuarioEditando
            ? 'Modifica los datos del empleado'
            : 'Ingresa los datos del nuevo usuario'
        }
        onCerrar={cerrarModal}
        onGuardar={guardarUsuario}
        guardando={guardando}
        textoGuardar={
          usuarioEditando ? 'Actualizar' : 'Guardar'
        }
      >
        <FormularioUsuario
          valores={formulario}
          onChange={setFormulario}
          editando={Boolean(usuarioEditando)}
          error={errorFormulario}
        />
      </Modal>
    </div>
  );
}

export default Usuarios;
