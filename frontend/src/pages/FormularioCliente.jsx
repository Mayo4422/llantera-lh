
import { Link, useParams } from 'react-router-dom';

function FormularioCliente() {
  const { id } = useParams();

  return (
    <div className="contenedor">
      <h1>{id ? 'Editar cliente' : 'Registrar cliente'}</h1>

      <form className="formulario">
        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Nombre del cliente"
        />

        <label>Teléfono</label>
        <input
          type="text"
          placeholder="Número de teléfono"
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="Correo electrónico"
        />

        <label>Dirección</label>
        <input
          type="text"
          placeholder="Dirección del cliente"
        />

        <div className="acciones">
          <button type="button">Guardar</button>

          <Link to="/clientes" className="boton boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FormularioCliente;
