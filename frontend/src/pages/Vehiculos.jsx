import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, CheckCircle2, Users, Search, Plus, Pencil, RefreshCw, Tag } from 'lucide-react';

import Modal from '../components/Modal';
import FormularioVehiculo from './FormularioVehiculo';
import { VEHICULO_INICIAL, validarVehiculo, cuerpoVehiculo } from '../utils/formularios';
import { useAuth } from '../context/AuthContext';
import { useCatalogos } from '../hooks/useCatalogos';
import { Mensajes, FilaVacia, Tarjeta } from '../components/Comunes';

function Vehiculos() {
  const { peticion } = useAuth();
  const { catalogos, recargarCatalogos } = useCatalogos();

  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({ ...VEHICULO_INICIAL });
  const [errorFormulario, setErrorFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [v, c] = await Promise.all([peticion('/vehiculos'), peticion('/clientes')]);
      setVehiculos(v.vehiculos);
      setClientes(c.clientes);
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

    return vehiculos.filter((v) =>
      [v.placas, v.cliente, v.marca, v.modelo, v.color, v.anio]
        .some((campo) => String(campo || '').toLowerCase().includes(texto))
    );
  }, [vehiculos, busqueda]);

  const abrirNuevo = () => {
    setEditando(null);
    setFormulario({ ...VEHICULO_INICIAL });
    setErrorFormulario('');
    setMostrarModal(true);
  };

  const abrirEditar = (v) => {
    setEditando(v);
    setFormulario({
      id_cliente: String(v.id_cliente),
      id_marca: String(v.id_marca),
      id_modelo: String(v.id_modelo),
      anio: String(v.anio),
      color: v.color,
      placas: v.placas || ''
    });
    setErrorFormulario('');
    setMostrarModal(true);
  };

  const cerrarModal = useCallback(() => setMostrarModal(false), []);

  const guardar = async () => {
    const problema = validarVehiculo(formulario);

    if (problema) {
      setErrorFormulario(problema);
      return;
    }

    setGuardando(true);

    try {
      const cuerpo = cuerpoVehiculo(formulario);
      const datos = editando
        ? await peticion(`/vehiculos/${editando.id_vehiculo}`, { method: 'PUT', body: cuerpo })
        : await peticion('/vehiculos', { method: 'POST', body: cuerpo });

      setMensaje(datos.mensaje);
      setMostrarModal(false);
      await cargar();
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (v) => {
    const activo = Number(v.activo) === 1;

    if (!window.confirm(`¿Deseas ${activo ? 'desactivar' : 'activar'} el vehículo ${v.placas || v.modelo}?`)) {
      return;
    }

    try {
      const datos = await peticion(`/vehiculos/${v.id_vehiculo}/estado`, {
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

  const marcasDistintas = new Set(vehiculos.map((v) => v.id_marca)).size;
  const clientesConVehiculo = new Set(vehiculos.map((v) => v.id_cliente)).size;

  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>Vehículos</h1>
          <p>Administración de los vehículos de los clientes</p>
        </div>

        <button type="button" className="boton-nuevo" onClick={abrirNuevo}>
          <Plus size={18} />
          Nuevo vehículo
        </button>
      </div>

      <div className="estadisticas">
        <Tarjeta titulo="Vehículos registrados" valor={vehiculos.length} icono={CarFront} />
        <Tarjeta
          titulo="Vehículos activos"
          valor={vehiculos.filter((v) => Number(v.activo) === 1).length}
          icono={CheckCircle2}
        />
        <Tarjeta titulo="Clientes con vehículo" valor={clientesConVehiculo} icono={Users} />
        <Tarjeta titulo="Marcas distintas" valor={marcasDistintas} icono={Tag} />
      </div>

      <Mensajes error={error} mensaje={mensaje} />

      <div className="tarjeta-tabla">
        <div className="tabla-encabezado">
          <div>
            <h3>Lista de vehículos</h3>
            <p>Relación de vehículos con su cliente, marca y modelo</p>
          </div>

          <button
            type="button"
            className="boton-icono"
            onClick={cargar}
            disabled={cargando}
            title="Actualizar lista"
            aria-label="Actualizar lista de vehículos"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="tabla-filtros">
          <div className="filtro-busqueda">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por placas, cliente, marca o modelo..."
              aria-label="Buscar vehículo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="tabla-responsive">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Placas</th>
                <th>Marca / modelo</th>
                <th>Año</th>
                <th>Color</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <FilaVacia columnas={7} titulo="Cargando vehículos..." />
              ) : filtrados.length === 0 ? (
                <FilaVacia
                  columnas={7}
                  icono={CarFront}
                  titulo={busqueda ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
                  texto={busqueda ? 'Intenta con otra búsqueda.' : 'Registra un cliente y después su vehículo.'}
                />
              ) : (
                filtrados.map((v) => {
                  const activo = Number(v.activo) === 1;

                  return (
                    <tr key={v.id_vehiculo} className={activo ? '' : 'fila-inactiva'}>
                      <td><strong>{v.placas || 'Sin placas'}</strong></td>
                      <td>{v.marca} {v.modelo}</td>
                      <td>{v.anio}</td>
                      <td>{v.color}</td>
                      <td>
                        <Link to={`/clientes/${v.id_cliente}`}>{v.cliente}</Link>
                      </td>
                      <td>{activo ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="acciones-tabla">
                          <button
                            type="button"
                            className="boton-icono"
                            title="Editar vehículo"
                            aria-label="Editar vehículo"
                            onClick={() => abrirEditar(v)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="boton-texto" onClick={() => cambiarEstado(v)}>
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
        titulo={editando ? 'Editar vehículo' : 'Nuevo vehículo'}
        descripcion="Datos del vehículo y su propietario"
        onCerrar={cerrarModal}
        onGuardar={guardar}
        guardando={guardando}
        textoGuardar={editando ? 'Actualizar' : 'Guardar vehículo'}
      >
        {errorFormulario && <p role="alert" className="mensaje-error">{errorFormulario}</p>}
        <FormularioVehiculo
          datos={formulario}
          onChange={(d) => {
            setFormulario(d);
            setErrorFormulario('');
          }}
          clientes={clientes}
          catalogos={catalogos}
          onCatalogoActualizado={recargarCatalogos}
        />
      </Modal>
    </div>
  );
}

export default Vehiculos;
