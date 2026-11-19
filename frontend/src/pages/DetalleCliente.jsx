import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CarFront, ClipboardList, Plus } from 'lucide-react';

import Modal from '../components/Modal';
import FormularioVehiculo from './FormularioVehiculo';
import { VEHICULO_INICIAL, validarVehiculo, cuerpoVehiculo } from '../utils/formularios';
import { useAuth } from '../context/AuthContext';
import { useCatalogos } from '../hooks/useCatalogos';
import { Etiqueta, FilaVacia, Mensajes } from '../components/Comunes';
import { fecha, folio } from '../utils/formato';

function DetalleCliente() {
  const { id } = useParams();
  const { peticion } = useAuth();
  const { catalogos, recargarCatalogos } = useCatalogos();

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState({ ...VEHICULO_INICIAL });
  const [errorFormulario, setErrorFormulario] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setDatos(await peticion(`/clientes/${id}`));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [peticion, id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cerrarModal = useCallback(() => setMostrarModal(false), []);

  const guardarVehiculo = async () => {
    const problema = validarVehiculo(formulario);

    if (problema) {
      setErrorFormulario(problema);
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await peticion('/vehiculos', {
        method: 'POST',
        body: cuerpoVehiculo(formulario)
      });
      setMensaje(respuesta.mensaje);
      setMostrarModal(false);
      await cargar();
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!datos) {
    return (
      <div className="contenedor">
        <Mensajes error={error} />
        {!error && <p>Cargando cliente...</p>}
        <Link to="/clientes" className="boton-texto"><ArrowLeft size={15} /> Volver a clientes</Link>
      </div>
    );
  }

  const { cliente, vehiculos, ordenes } = datos;
  const activo = Number(cliente.activo) === 1;

  return (
    <div className="contenedor">
      <div className="encabezado-pagina">
        <div>
          <h1>{cliente.nombre_completo}</h1>
          <p>Detalle del cliente, sus vehículos y su historial de servicios</p>
        </div>

        <Link to="/clientes" className="boton-texto">
          <ArrowLeft size={15} /> Volver a clientes
        </Link>
      </div>

      <Mensajes error={error} mensaje={mensaje} />

      <div className="tarjeta-tabla bloque">
        <h3>Información del cliente</h3>
        <dl className="lista-datos">
          <div><dt>Teléfono</dt><dd>{cliente.telefono}</dd></div>
          <div><dt>Correo</dt><dd>{cliente.correo || '—'}</dd></div>
          <div><dt>Tipo de cliente</dt><dd>{cliente.tipo_cliente}</dd></div>
          <div><dt>Registrado</dt><dd>{fecha(cliente.fecha_registro, false)}</dd></div>
          <div><dt>Estado</dt><dd>{activo ? 'Activo' : 'Inactivo'}</dd></div>
        </dl>
      </div>

      <div className="tarjeta-tabla bloque">
        <div className="tabla-encabezado">
          <div>
            <h3>Vehículos registrados</h3>
            <p>{vehiculos.length} vehículo(s)</p>
          </div>

          {activo && (
            <button
              type="button"
              className="boton-nuevo"
              onClick={() => {
                setFormulario({ ...VEHICULO_INICIAL, id_cliente: String(cliente.id_cliente) });
                setErrorFormulario('');
                setMostrarModal(true);
              }}
            >
              <Plus size={16} /> Agregar vehículo
            </button>
          )}
        </div>

        <div className="tabla-responsive">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Placas</th>
                <th>Color</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.length === 0 ? (
                <FilaVacia columnas={6} icono={CarFront} titulo="Sin vehículos registrados" />
              ) : (
                vehiculos.map((v) => (
                  <tr key={v.id_vehiculo} className={Number(v.activo) === 1 ? '' : 'fila-inactiva'}>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.anio}</td>
                    <td>{v.placas || '—'}</td>
                    <td>{v.color}</td>
                    <td>{Number(v.activo) === 1 ? 'Activo' : 'Inactivo'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tarjeta-tabla bloque">
        <h3>Historial de servicios</h3>
        <div className="tabla-responsive">
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Vehículo</th>
                <th>Servicio</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length === 0 ? (
                <FilaVacia columnas={5} icono={ClipboardList} titulo="Sin órdenes de servicio" />
              ) : (
                ordenes.map((o) => (
                  <tr key={o.id_orden}>
                    <td><Link to={`/ordenes?orden=${o.id_orden}`}>{folio(o.id_orden)}</Link></td>
                    <td>{fecha(o.fecha_llegada)}</td>
                    <td>{o.vehiculo} {o.placas ? `(${o.placas})` : ''}</td>
                    <td>{o.categoria}</td>
                    <td><Etiqueta texto={o.estatus} color={o.color_hex} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        abierto={mostrarModal}
        titulo="Agregar vehículo"
        descripcion={`Vehículo de ${cliente.nombre_completo}`}
        onCerrar={cerrarModal}
        onGuardar={guardarVehiculo}
        guardando={guardando}
        textoGuardar="Guardar vehículo"
      >
        {errorFormulario && <p role="alert" className="mensaje-error">{errorFormulario}</p>}
        <FormularioVehiculo
          datos={formulario}
          onChange={(d) => {
            setFormulario(d);
            setErrorFormulario('');
          }}
          catalogos={catalogos}
          clienteFijo
          onCatalogoActualizado={recargarCatalogos}
        />
      </Modal>
    </div>
  );
}

export default DetalleCliente;
