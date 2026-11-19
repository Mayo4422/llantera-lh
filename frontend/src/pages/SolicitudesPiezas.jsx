import { useState } from 'react';

import {
    Package,
    Clock,
    CheckCheck,
    CircleX,
    Search,
    Plus
} from 'lucide-react';

import Modal from '../components/Modal';
import FormularioSolicitud from './FormularioSolicitud';

function SolicitudesPiezas() {
    const [mostrarModal, setMostrarModal] = useState(false);

    return (
        <div className="contenedor">

            <div className="encabezado-pagina">
                <div>
                    <h1>Solicitudes de piezas</h1>
                    <p>
                        Control de materiales solicitados para
                        las órdenes de servicio
                    </p>
                </div>

                <button
                    type="button"
                    className="boton-nuevo"
                    onClick={() => setMostrarModal(true)}
                >
                    <Plus size={18} />
                    Nueva solicitud
                </button>
            </div>

            <div className="estadisticas">

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Solicitudes totales</p>
                        <h2>0</h2>
                    </div>
                    <Package size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Pendientes</p>
                        <h2>0</h2>
                    </div>
                    <Clock size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Atendidas</p>
                        <h2>0</h2>
                    </div>
                    <CheckCheck size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Canceladas</p>
                        <h2>0</h2>
                    </div>
                    <CircleX size={24} />
                </div>

            </div>

            <div className="tarjeta-tabla">

                <div className="tabla-encabezado">
                    <div>
                        <h3>Lista de solicitudes</h3>
                        <p>
                            Consulta y seguimiento de materiales
                            solicitados
                        </p>
                    </div>
                </div>

                <div className="tabla-filtros">

                    <div className="filtro-busqueda">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar solicitud..."
                            aria-label="Buscar solicitud"
                        />
                    </div>

                    <div className="filtro-rol">
                        <select defaultValue="todos">
                            <option value="todos">
                                Todos los estados
                            </option>
                            <option value="pendiente">
                                Pendiente
                            </option>
                            <option value="atendida">
                                Atendida
                            </option>
                            <option value="cancelada">
                                Cancelada
                            </option>
                        </select>
                    </div>

                </div>

                <div className="tabla-responsive">
                    <table className="tabla-solicitudes">

                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Pieza o material</th>
                                <th>Cantidad</th>
                                <th>Solicitante</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td colSpan={7}>
                                    <div className="solicitudes-vacias">

                                        <Package size={36} />

                                        <h4>
                                            No hay solicitudes registradas
                                        </h4>

                                        <p>
                                            Las solicitudes aparecerán aquí
                                            cuando se registren.
                                        </p>

                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            </div>

            <Modal
                abierto={mostrarModal}
                titulo="Nueva solicitud de pieza"
                descripcion="Ingresa los datos del material solicitado"
                onCerrar={() => setMostrarModal(false)}
            >
                <FormularioSolicitud />
            </Modal>

        </div>
    );
}

export default SolicitudesPiezas;
