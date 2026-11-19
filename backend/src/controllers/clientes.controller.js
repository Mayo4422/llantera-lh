const pool = require('../db/pool');
const {
  ErrorApi,
  exigirId,
  textoObligatorio,
  textoOpcional,
  booleano
} = require('../utils/comun');

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CAMPOS_CLIENTE = `
  c.id_cliente,
  c.nombre_completo,
  c.telefono,
  c.correo,
  c.id_tipo_cliente,
  t.nombre AS tipo_cliente,
  c.fecha_registro,
  c.activo
`;

const validarCliente = async (cuerpo = {}) => {
  const nombre = textoObligatorio(
    cuerpo.nombre_completo,
    3,
    120,
    'El nombre del cliente'
  );

  const telefono = String(cuerpo.telefono ?? '').replace(/\D/g, '');

  if (!/^[0-9]{10}$/.test(telefono)) {
    throw new ErrorApi(400, 'El teléfono debe tener exactamente 10 dígitos');
  }

  const correo = textoOpcional(cuerpo.correo, 120, 'El correo');

  if (correo && !REGEX_CORREO.test(correo)) {
    throw new ErrorApi(400, 'El correo electrónico no es válido');
  }

  const idTipo = exigirId(cuerpo.id_tipo_cliente, 'El tipo de cliente');

  const [tipo] = await pool.execute(
    'SELECT id_tipo_cliente FROM tipo_cliente WHERE id_tipo_cliente = ?',
    [idTipo]
  );

  if (tipo.length === 0) {
    throw new ErrorApi(400, 'El tipo de cliente no existe');
  }

  return { nombre, telefono, correo, idTipo };
};

const obtenerCliente = async (id) => {
  const [filas] = await pool.execute(
    `SELECT ${CAMPOS_CLIENTE}
     FROM cliente c
     INNER JOIN tipo_cliente t ON t.id_tipo_cliente = c.id_tipo_cliente
     WHERE c.id_cliente = ?`,
    [id]
  );

  return filas[0] || null;
};

const listarClientes = async (req, res) => {
  const busqueda = String(req.query.q || '').trim().slice(0, 100);
  const parametros = [];
  let filtro = '';

  if (busqueda) {
    filtro = 'WHERE c.nombre_completo LIKE ? OR c.telefono LIKE ? OR c.correo LIKE ?';
    const patron = `%${busqueda}%`;
    parametros.push(patron, patron, patron);
  }

  const [clientes] = await pool.execute(
    `SELECT ${CAMPOS_CLIENTE},
            (SELECT COUNT(*) FROM vehiculo v
             WHERE v.id_cliente = c.id_cliente AND v.activo = 1) AS total_vehiculos
     FROM cliente c
     INNER JOIN tipo_cliente t ON t.id_tipo_cliente = c.id_tipo_cliente
     ${filtro}
     ORDER BY c.nombre_completo`,
    parametros
  );

  res.json({ ok: true, clientes });
};

const consultarCliente = async (req, res) => {
  const id = exigirId(req.params.id, 'El cliente');
  const cliente = await obtenerCliente(id);

  if (!cliente) {
    throw new ErrorApi(404, 'Cliente no encontrado');
  }

  const [vehiculos] = await pool.execute(
    `SELECT v.id_vehiculo, v.anio, v.color, v.placas, v.activo,
            v.id_modelo, mo.nombre AS modelo, ma.id_marca, ma.nombre AS marca
     FROM vehiculo v
     INNER JOIN modelo mo ON mo.id_modelo = v.id_modelo
     INNER JOIN marca ma ON ma.id_marca = mo.id_marca
     WHERE v.id_cliente = ?
     ORDER BY v.fecha_registro DESC`,
    [id]
  );

  const [ordenes] = await pool.execute(
    `SELECT o.id_orden, o.fecha_llegada, o.id_estatus,
            e.nombre AS estatus, e.color_hex,
            cs.nombre AS categoria, v.placas,
            CONCAT(ma.nombre, ' ', mo.nombre) AS vehiculo
     FROM orden_servicio o
     INNER JOIN vehiculo v ON v.id_vehiculo = o.id_vehiculo
     INNER JOIN modelo mo ON mo.id_modelo = v.id_modelo
     INNER JOIN marca ma ON ma.id_marca = mo.id_marca
     INNER JOIN estatus_orden e ON e.id_estatus = o.id_estatus
     INNER JOIN categoria_servicio cs ON cs.id_categoria = o.id_categoria
     WHERE v.id_cliente = ?
     ORDER BY o.fecha_llegada DESC
     LIMIT 50`,
    [id]
  );

  res.json({ ok: true, cliente, vehiculos, ordenes });
};

const crearCliente = async (req, res) => {
  const datos = await validarCliente(req.body);

  const [resultado] = await pool.execute(
    `INSERT INTO cliente (nombre_completo, telefono, correo, id_tipo_cliente)
     VALUES (?, ?, ?, ?)`,
    [datos.nombre, datos.telefono, datos.correo, datos.idTipo]
  );

  res.status(201).json({
    ok: true,
    mensaje: 'Cliente registrado correctamente',
    cliente: await obtenerCliente(resultado.insertId)
  });
};

const actualizarCliente = async (req, res) => {
  const id = exigirId(req.params.id, 'El cliente');

  if (!(await obtenerCliente(id))) {
    throw new ErrorApi(404, 'Cliente no encontrado');
  }

  const datos = await validarCliente(req.body);

  await pool.execute(
    `UPDATE cliente
     SET nombre_completo = ?, telefono = ?, correo = ?, id_tipo_cliente = ?
     WHERE id_cliente = ?`,
    [datos.nombre, datos.telefono, datos.correo, datos.idTipo, id]
  );

  res.json({
    ok: true,
    mensaje: 'Cliente actualizado correctamente',
    cliente: await obtenerCliente(id)
  });
};

const cambiarEstadoCliente = async (req, res) => {
  const id = exigirId(req.params.id, 'El cliente');
  const activo = booleano(req.body?.activo);

  if (!(await obtenerCliente(id))) {
    throw new ErrorApi(404, 'Cliente no encontrado');
  }

  await pool.execute(
    'UPDATE cliente SET activo = ? WHERE id_cliente = ?',
    [activo, id]
  );

  res.json({
    ok: true,
    mensaje: activo ? 'Cliente activado' : 'Cliente desactivado'
  });
};

module.exports = {
  listarClientes,
  consultarCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente
};
