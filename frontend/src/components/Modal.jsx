
import { useEffect, useId } from 'react';

import {
  X,
  Save
} from 'lucide-react';

function Modal({
  abierto,
  titulo,
  descripcion,
  onCerrar,
  children
}) {
  const tituloId = useId();

  useEffect(() => {
    if (!abierto) return;

    function manejarTeclado(event) {
      if (event.key === 'Escape') {
        onCerrar();
      }
    }

    window.addEventListener('keydown', manejarTeclado);

    return () => {
      window.removeEventListener('keydown', manejarTeclado);
    };
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="modal-fondo"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCerrar();
        }
      }}
    >

      <div
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >

        <div className="modal-encabezado">

          <div>
            <h2 id={tituloId}>{titulo}</h2>
            <p>{descripcion}</p>
          </div>

          <button
            type="button"
            className="modal-cerrar"
            aria-label="Cerrar formulario"
            onClick={onCerrar}
          >
            <X size={20} />
          </button>

        </div>

        <div className="modal-cuerpo">
          {children}
        </div>

        <div className="modal-pie">

          <button
            type="button"
            className="boton-cancelar"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="boton-guardar"
            onClick={onCerrar}
          >
            <Save size={17} />
            Guardar
          </button>

        </div>

      </div>

    </div>
  );
}

export default Modal;
