
import { Link, useParams } from 'react-router-dom';

function FormularioUsuario() {
  const { id } = useParams();

  return (
    <div className="contenedor">
      <h1>{id ? 'Editar usuario' : 'Registrar usuario'}</h1>

      <form className="formulario">
        <label>Nombre completo</label>
        <input type="text" placeholder="Nombre completo" />

        <label>Usuario</label>
        <input type="text" placeholder="Nombre de usuario" />

        <label>Contraseña</label>
        <input type="password" placeholder="Contraseña" />

        <label>Rol</label>
        <select defaultValue="">
          <option value="">Seleccionar rol</option>
          <option>Administrador</option>
          <option>Mecánico</option>
          <option>Cajero</option>
        </select>

        <div className="acciones">
          <button type="button">Guardar</button>

          <Link to="/usuarios" className="boton boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FormularioUsuario;
