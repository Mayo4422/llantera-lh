export const VEHICULO_INICIAL = {
  id_cliente: '',
  id_marca: '',
  id_modelo: '',
  anio: '',
  color: '',
  placas: ''
};

export function validarVehiculo(datos) {
  const anio = Number(datos.anio);

  if (!datos.id_cliente) return 'Selecciona el cliente.';
  if (!datos.id_modelo) return 'Selecciona la marca y el modelo.';
  if (!Number.isInteger(anio) || anio < 1950 || anio > new Date().getFullYear() + 1) {
    return 'Ingresa un año válido.';
  }
  if (datos.color.trim().length < 2) return 'Ingresa el color.';

  const placas = datos.placas.replace(/[\s-]/g, '');
  if (placas && !/^[A-Z0-9]{5,10}$/i.test(placas)) {
    return 'Las placas deben tener de 5 a 10 letras o números.';
  }

  return '';
}

export const cuerpoVehiculo = (datos) => ({
  id_cliente: Number(datos.id_cliente),
  id_modelo: Number(datos.id_modelo),
  anio: Number(datos.anio),
  color: datos.color.trim(),
  placas: datos.placas.trim()
});
