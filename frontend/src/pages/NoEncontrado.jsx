
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

function NoEncontrado() {
  return (
    <div className="contenedor">
      <div className="pagina-no-encontrada">

        <FileQuestion size={52} />

        <h1>404</h1>
        <h2>Página no encontrada</h2>

        <p>
          La dirección que intentas visitar no existe
          o ya no está disponible.
        </p>

        <Link
          to="/usuarios"
          className="boton"
        >
          <ArrowLeft size={18} />
          Volver al sistema
        </Link>

      </div>
    </div>
  );
}

export default NoEncontrado;
  