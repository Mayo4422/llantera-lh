import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../components/Modal';
import FormularioCliente from './FormularioCliente';
import { useAuth } from '../context/AuthContext';
import { useCatalogos } from '../hooks/useCatalogos';
import { Mensajes, FilaVacia, Tarjeta } from '../components/Comunes';

import {
  Users,
  UserCheck,
  CarFront,
  Search,
  Plus,
  Pencil,
  Eye,
  RefreshCw
} from 'lucide-react';

const FORMULARIO_INICIAL = {
  nombre_completo: '',
  telefono: '',
  correo: '',
  id_tipo_cliente: '1'
};

function Clientes() {
  const { peticion } = useAuth();
  const { catalogos } = useCatalogos();

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL });
  const [errorFormulario, setErrorFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await peticion('/clientes');
      setClientes(datos.clientes);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [peticion]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return clientes.filter((c) =>
      [c.nombre_completo, c.telefono, c.correo]
        .some((campo) => String(campo || '').toLowerCase().includes(texto))
    );
  }, [clientes, busqueda]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario({ ...FORMULARIO_INICIAL });
    setErrorFormulario('');
    setMostrarModal(true);
  };

  const abrirEditar = (cliente) => {
    setEditando(cliente);
    setFormulario({
      nombre_completo: cliente.nombre_completo,
      telefono: cliente.telefono,
      correo: cliente.correo || '',
      id_tipo_cliente: String(cliente.id_tipo_cliente)
    });
    setErrorFormulario('');
    setMostrarModal(true);
  };

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setErrorFormulario('');
  }, []);

  const guardar = async () => {
    const nombre = formulario.nombre_completo.trim();
    const correo = formulario.correo.trim();

    if (nombre.length < 3) {
      setErrorFormulario('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formulario.telefono)) {
      setErrorFormulario('El teléfono debe tener 10 dígitos.');
      return;
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setErrorFormulario('Ingresa un correo electrónico válido.');
      return;
    }

    if (!formulario.id_tipo_cliente) {
      setErrorFormulario('Selecciona el tipo de cliente.');
      return;
    }

    setGuardando(true);
    setErrorFormulario('');

    try {
      const cuerpo = {
        nombre_completo: nombre,
        telefono: formulario.telefono,
        correo,
        id_tipo_cliente: Number(formulario.id_tipo_cliente)
      };

      const datos = editando
        ? await peticion(`/clientes/${editando.id_cliente}`, { method: 'PUT', body: cuerpo })
        : await peticion('/clientes', { method: 'POST', body: cuerpo });

      setMensaje(datos.mensaje);
      setMostrarModal(false);
      await cargar();
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (cliente) => {
    const activo = Number(cliente.activo) === 1;

    if (!window.confirm(`¿Deseas ${activo ? 'desactivar' : 'activar'} a ${cliente.nombre_completo}?`)) {
      return;
    }

    try {
      const datos = await peticion(`/clientes/${cliente.id_cliente}/estado`, {
        method: 'PATCH',
        body: { activo: activo ? 0 : 1 }
      });
      setMensaje(datos.mensaje);
      setError('');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const totalVehiculos = clientes.reduce((suma, c) => suma + Number(c.total_vehiculos || 0), 0);

  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>Clientes</h1>
          <p>Administración de clientes del sistema</p>
        </div>

        <button type="button" className="boton-nuevo" onClick={abrirNuevo}>
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>

      <div className="estadisticas">
        <Tarjeta titulo="Clientes totales" valor={clientes.length} icono={Users} />
        <Tarjeta
          titulo="Clientes activos"
          valor={clientes.filter((c) => Number(c.activo) === 1).length}
          icono={UserCheck}
        />
        <Tarjeta titulo="Vehículos registrados" valor={totalVehiculos} icono={CarFront} />
        <Tarjeta
          titulo="Clientes de mayoreo"
          valor={clientes.filter((c) => Number(c.id_tipo_cliente) === 2).length}
          icono={Users}
        />
      </div>

      <Mensajes error={error} mensaje={mensaje} />

      <div className="tarjeta-tabla">
        <div className="tabla-encabezado">
          <div>
            <h3>Lista de clientes</h3>
            <p>Consulta y administración de clientes</p>
          </div>

          <button
            type="button"
            className="boton-icono"
            onClick={cargar}
            disabled={cargando}
            title="Actualizar lista"
            aria-label="Actualizar lista de clientes"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por nombre, teléfono o correo..."
              aria-label="Buscar cliente"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="tabla-responsive">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Vehículos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <FilaVacia columnas={7} titulo="Cargando clientes..." />
              ) : filtrados.length === 0 ? (
                <FilaVacia
                  columnas={7}
                  icono={Users}
                  titulo={busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                  texto={busqueda ? 'Intenta con otra búsqueda.' : 'Registra el primer cliente con “Nuevo cliente”.'}
                />
              ) : (
                filtrados.map((cliente) => {
                  const activo = Number(cliente.activo) === 1;

                  return (
                    <tr key={cliente.id_cliente} className={activo ? '' : 'fila-inactiva'}>
                      <td><strong>{cliente.nombre_completo}</strong></td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.correo || '—'}</td>
                      <td>{cliente.tipo_cliente}</td>
                      <td>{cliente.total_vehiculos}</td>
                      <td>{activo ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="acciones-tabla">
                          <Link
                            to={`/clientes/${cliente.id_cliente}`}
                            className="boton-icono"
                            title="Ver detalle"
                            aria-label={`Ver detalle de ${cliente.nombre_completo}`}
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            type="button"
                            className="boton-icono"
                            title="Editar cliente"
                            aria-label={`Editar ${cliente.nombre_completo}`}
                            onClick={() => abrirEditar(cliente)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="boton-texto"
                            onClick={() => cambiarEstado(cliente)}
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
      </div>

      <Modal
        abierto={mostrarModal}
        titulo={editando ? 'Editar cliente' : 'Nuevo cliente'}
        descripcion={editando ? 'Modifica los datos del cliente' : 'Ingresa los datos del nuevo cliente'}
        onCerrar={cerrarModal}
        onGuardar={guardar}
        guardando={guardando}
        textoGuardar={editando ? 'Actualizar' : 'Guardar cliente'}
      >
        {errorFormulario && <p role="alert" className="mensaje-error">{errorFormulario}</p>}
        <FormularioCliente
          datos={formulario}
          tiposCliente={catalogos.tiposCliente}
          onChange={(nuevos) => {
            setFormulario(nuevos);
            setErrorFormulario('');
          }}
        />
      </Modal>
    </div>
  );
}

export default Clientes;
