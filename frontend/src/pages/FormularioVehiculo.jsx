import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function FormularioVehiculo({
  datos,
  onChange,
  clientes = [],
  catalogos,
  clienteFijo = false,
  onCatalogoActualizado
}) {
  const { peticion } = useAuth();
  const [nuevoModelo, setNuevoModelo] = useState('');
  const [errorModelo, setErrorModelo] = useState('');

  const modelos = catalogos.modelos.filter(
    (m) => String(m.id_marca) === String(datos.id_marca)
  );

  const actualizar = (event) => {
    const { name, value } = event.target;
    const cambios = { ...datos, [name]: value };

    if (name === 'id_marca') cambios.id_modelo = '';
    if (name === 'placas') cambios.placas = value.toUpperCase();

    onChange(cambios);
  };

  const agregarModelo = async () => {
    setErrorModelo('');

    if (!datos.id_marca || !nuevoModelo.trim()) {
      setErrorModelo('Elige la marca y escribe el nombre del modelo.');
      return;
    }

    try {
      const respuesta = await peticion('/catalogos/modelos', {
        method: 'POST',
        body: { id_marca: Number(datos.id_marca), nombre: nuevoModelo.trim() }
      });

      setNuevoModelo('');
      await onCatalogoActualizado?.();
      onChange({ ...datos, id_modelo: String(respuesta.modelo.id_modelo) });
    } catch (err) {
      setErrorModelo(err.message);
    }
  };

  return (
    <>
      {!clienteFijo && (
        <div className="campo-formulario">
          <label htmlFor="vehiculo-cliente">Cliente</label>
          <select
            id="vehiculo-cliente"
            name="id_cliente"
            value={datos.id_cliente}
            onChange={actualizar}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes
              .filter((c) => Number(c.activo) === 1)
              .map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_completo} — {c.telefono}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className="formulario-columnas">
        <div className="campo-formulario">
          <label htmlFor="vehiculo-marca">Marca</label>
          <select
            id="vehiculo-marca"
            name="id_marca"
            value={datos.id_marca}
            onChange={actualizar}
            required
          >
            <option value="">Selecciona una marca</option>
            {catalogos.marcas.map((m) => (
              <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="campo-formulario">
          <label htmlFor="vehiculo-modelo">Modelo</label>
          <select
            id="vehiculo-modelo"
            name="id_modelo"
            value={datos.id_modelo}
            onChange={actualizar}
            disabled={!datos.id_marca}
            required
          >
            <option value="">Selecciona un modelo</option>
            {modelos.map((m) => (
              <option key={m.id_modelo} value={m.id_modelo}>{m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {datos.id_marca && (
        <div className="campo-formulario">
          <label htmlFor="vehiculo-nuevo-modelo">¿No aparece el modelo? Agrégalo</label>
          <div className="campo-con-boton">
            <input
              id="vehiculo-nuevo-modelo"
              type="text"
              maxLength={60}
              placeholder="Nombre del modelo"
              value={nuevoModelo}
              onChange={(e) => setNuevoModelo(e.target.value)}
            />
            <button type="button" className="boton-texto" onClick={agregarModelo}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          {errorModelo && <p className="mensaje-error">{errorModelo}</p>}
        </div>
      )}

      <div className="formulario-columnas">
        <div className="campo-formulario">
          <label htmlFor="vehiculo-anio">Año</label>
          <input
            id="vehiculo-anio"
            name="anio"
            type="number"
            min={1950}
            max={new Date().getFullYear() + 1}
            placeholder="2020"
            value={datos.anio}
            onChange={actualizar}
            required
          />
        </div>

        <div className="campo-formulario">
          <label htmlFor="vehiculo-color">Color</label>
          <input
            id="vehiculo-color"
            name="color"
            type="text"
            maxLength={30}
            placeholder="Blanco"
            value={datos.color}
            onChange={actualizar}
            required
          />
        </div>
      </div>

      <div className="campo-formulario">
        <label htmlFor="vehiculo-placas">Placas (opcional)</label>
        <input
          id="vehiculo-placas"
          name="placas"
          type="text"
          maxLength={12}
          placeholder="JAL123A"
          value={datos.placas}
          onChange={actualizar}
        />
      </div>
    </>
  );
}

export default FormularioVehiculo;
