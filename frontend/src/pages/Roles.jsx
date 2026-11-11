
import {
  Shield,
  Users
} from 'lucide-react';

function Roles() {
  return (
    <div className="contenedor">

      {/* ENCABEZADO */}

      <div className="encabezado-pagina">
        <div>
          <h1>Roles</h1>
          <p>
            Administración de roles y permisos del sistema
          </p>
        </div>
      </div>

      {/* ESTADÍSTICAS */}

      <div className="estadisticas estadisticas-roles">

        <div className="tarjeta-estadistica">
          <div>
            <p>Roles del sistema</p>
            <h2>3</h2>
          </div>
          <Shield size={24} />
        </div>

        <div className="tarjeta-estadistica">
          <div>
            <p>Usuarios asignados</p>
            <h2>0</h2>
          </div>
          <Users size={24} />
        </div>

      </div>

      {/* TABLA DE ROLES */}

      <div className="tarjeta-tabla">

        <div className="tabla-encabezado">
          <div>
            <h3>Lista de roles</h3>
            <p>Roles disponibles para el personal</p>
          </div>
        </div>

        <table className="tabla-roles">

          <thead>
            <tr>
              <th>Rol</th>
              <th>Descripción</th>
              <th>Usuarios asignados</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>
                <span className="etiqueta-rol">
                  Administrador
                </span>
              </td>
              <td>Administración del sistema</td>
              <td>0</td>
            </tr>

            <tr>
              <td>
                <span className="etiqueta-rol">
                  Mecánico
                </span>
              </td>
              <td>Operación de servicios</td>
              <td>0</td>
            </tr>

            <tr>
              <td>
                <span className="etiqueta-rol">
                  Cajero
                </span>
              </td>
              <td>Cobros y entregas</td>
              <td>0</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Roles;
