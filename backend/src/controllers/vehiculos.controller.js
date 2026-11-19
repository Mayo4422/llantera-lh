const pool = require('../db/pool');
const {
  ErrorApi,
  exigirId,

  textoObligatorio,
  booleano
} = require('../utils/comun');

const CAMPOS_VEHICULO = `
  v.id_vehiculo,
  v.id_cliente,
  c.nombre_completo AS cliente,
  c.telefono AS telefono_cliente,
  v.id_modelo,
  mo.nombre AS modelo,
  ma.id_marca,
  ma.nombre AS marca,
  v.anio,
  v.color,
  v.placas,
  v.fecha_registro,
  v.activo
`;

const FROM_VEHICULO = `
  FROM vehiculo v
  INNER JOIN cliente c ON c.id_cliente = v.id_cliente
  INNER JOIN modelo mo ON mo.id_modelo = v.id_modelo
  INNER JOIN marca ma ON ma.id_marca = mo.id_marca
`;

const validarVehiculo = async (cuerpo = {}) => {
  const idCliente = exigirId(cuerpo.id_cliente, 'El cliente');
  const idModelo = exigirId(cuerpo.id_modelo, 'El modelo');
  const anio = Number(cuerpo.anio);
  const anioMaximo = new Date().getFullYear() + 1;

  if (!Number.isInteger(anio) || anio < 1950 || anio > anioMaximo) {
    throw new ErrorApi(400, `El año debe estar entre 1950 y ${anioMaximo}`);
  }

  const color = textoObligatorio(cuerpo.color, 2, 30, 'El color');

  let placas = String(cuerpo.placas ?? '')
    .toUpperCase()
    .replace(/[\s-]/g, '');

  if (placas && !/^[A-Z0-9]{5,10}$/.test(placas)) {
    throw new ErrorApi(400, 'Las placas deben tener de 5 a 10 letras o números');
  }

  placas = placas || null;

  const [[cliente], [modelo]] = await Promise.all([
    pool.execute('SELECT id_cliente, activo FROM cliente WHERE id_cliente = ?', [idCliente]),
    pool.execute('SELECT id_modelo FROM modelo WHERE id_modelo = ?', [idModelo])
  ]);

  if (cliente.length === 0) {
    throw new ErrorApi(400, 'El cliente no existe');
  }

  if (Number(cliente[0].activo) !== 1) {
    throw new ErrorApi(400, 'El cliente está desactivado');
  }

  if (modelo.length === 0) {
    throw new ErrorApi(400, 'El modelo no existe');
  }

  return { idCliente, idModelo, anio, color, placas };
};

const obtenerVehiculo = async (id) => {
  const [filas] = await pool.execute(
    `SELECT ${CAMPOS_VEHICULO} ${FROM_VEHICULO} WHERE v.id_vehiculo = ?`,
    [id]
  );

  return filas[0] || null;
};

const listarVehiculos = async (req, res) => {
  const condiciones = [];
  const parametros = [];
  const busqueda = String(req.query.q || '').trim().slice(0, 100);

  if (busqueda) {
    condiciones.push(
      `(v.placas LIKE ? OR c.nombre_completo LIKE ? OR ma.nombre LIKE ? OR mo.nombre LIKE ?)`
    );
    const patron = `%${busqueda}%`;
    parametros.push(patron, patron, patron, patron);
  }

  if (req.query.id_cliente !== undefined) {
    condiciones.push('v.id_cliente = ?');
    parametros.push(exigirId(req.query.id_cliente, 'El cliente'));
  }

  if (req.query.activos === '1') {
    condiciones.push('v.activo = 1');
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [vehiculos] = await pool.execute(
    `SELECT ${CAMPOS_VEHICULO} ${FROM_VEHICULO} ${where}
     ORDER BY v.fecha_registro DESC`,
    parametros
  );

  res.json({ ok: true, vehiculos });
};

const consultarVehiculo = async (req, res) => {
  const id = exigirId(req.params.id, 'El vehículo');
  const vehiculo = await obtenerVehiculo(id);

  if (!vehiculo) {
    throw new ErrorApi(404, 'Vehículo no encontrado');
  }

  res.json({ ok: true, vehiculo });
};

const crearVehiculo = async (req, res) => {
  const datos = await validarVehiculo(req.body);

  try {
    const [resultado] = await pool.execute(
      `INSERT INTO vehiculo (id_cliente, id_modelo, anio, color, placas)
       VALUES (?, ?, ?, ?, ?)`,
      [datos.idCliente, datos.idModelo, datos.anio, datos.color, datos.placas]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Vehículo registrado correctamente',
      vehiculo: await obtenerVehiculo(resultado.insertId)
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ErrorApi(409, 'Ya existe un vehículo con esas placas');
    }
    throw error;
  }
};

const actualizarVehiculo = async (req, res) => {
  const id = exigirId(req.params.id, 'El vehículo');

  if (!(await obtenerVehiculo(id))) {
    throw new ErrorApi(404, 'Vehículo no encontrado');
  }

  const datos = await validarVehiculo(req.body);

  try {
    await pool.execute(
      `UPDATE vehiculo
       SET id_cliente = ?, id_modelo = ?, anio = ?, color = ?, placas = ?
       WHERE id_vehiculo = ?`,
      [datos.idCliente, datos.idModelo, datos.anio, datos.color, datos.placas, id]
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ErrorApi(409, 'Ya existe un vehículo con esas placas');
    }
    throw error;
  }

  res.json({
    ok: true,
    mensaje: 'Vehículo actualizado correctamente',
    vehiculo: await obtenerVehiculo(id)
  });
};

const cambiarEstadoVehiculo = async (req, res) => {
  const id = exigirId(req.params.id, 'El vehículo');
  const activo = booleano(req.body?.activo);

  if (!(await obtenerVehiculo(id))) {
    throw new ErrorApi(404, 'Vehículo no encontrado');
  }

  if (!activo) {

    const [abiertas] = await pool.execute(
      'SELECT COUNT(*) AS total FROM orden_servicio WHERE id_vehiculo = ? AND id_estatus NOT IN (6, 7)',
      [id]
    );

    if (abiertas[0].total > 0) {
      throw new ErrorApi(409, 'El vehículo tiene órdenes abiertas');
    }
  }

  await pool.execute(
    'UPDATE vehiculo SET activo = ? WHERE id_vehiculo = ?',
    [activo, id]
  );

  res.json({
    ok: true,
    mensaje: activo ? 'Vehículo activado' : 'Vehículo desactivado'
  });
};

module.exports = {
  listarVehiculos,
  consultarVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  cambiarEstadoVehiculo
};
