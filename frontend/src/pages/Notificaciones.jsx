
import { useState } from 'react';
import {
    Bell,
    BellRing,
    MailOpen,
    ClipboardList,
    Search,
    Inbox
} from 'lucide-react';

function Notificaciones() {
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('todas');

    return (
        <div className="contenedor">
            <div className="encabezado-pagina">
                <div>
                    <h1>Notificaciones</h1>
                    <p>Comunicación operativa entre los trabajadores</p>
                </div>
            </div>

            <div className="estadisticas">
                <div className="tarjeta-estadistica">
                    <div>
                        <p>Total de notificaciones</p>
                        <h2>0</h2>
                    </div>
                    <Bell size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Sin leer</p>
                        <h2>0</h2>
                    </div>
                    <BellRing size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Leídas</p>
                        <h2>0</h2>
                    </div>
                    <MailOpen size={24} />
                </div>

                <div className="tarjeta-estadistica">
                    <div>
                        <p>Avisos de órdenes</p>
                        <h2>0</h2>
                    </div>
                    <ClipboardList size={24} />
                </div>
            </div>

            <div className="tarjeta-tabla">
                <div className="tabla-encabezado">
                    <div>
                        <h3>Bandeja de notificaciones</h3>
                        <p>Avisos de servicios, piezas y entregas</p>
                    </div>
                </div>

                <div className="tabla-filtros">
                    <div className="filtro-busqueda">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Buscar notificación..."
                            aria-label="Buscar notificación"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="filtro-rol">
                        <select
                            aria-label="Filtrar notificaciones"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="todas">Todas</option>
                            <option value="sin-leer">Sin leer</option>
                            <option value="leidas">Leídas</option>
                        </select>
                    </div>
                </div>

                <div className="tabla-responsive">
                    <table className="tabla-modulo">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Notificación</th>
                                <th>Orden relacionada</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <div className="vista-vacia">
                                        <Inbox size={38} />
                                        <h4>No hay notificaciones</h4>
                                        <p>
                                            Los avisos de los trabajadores aparecerán aquí
                                            cuando estén disponibles.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Notificaciones;
