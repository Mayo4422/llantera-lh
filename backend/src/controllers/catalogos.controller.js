const pool = require('../db/pool');
const {
  ROLES,
  ErrorApi,
  exigirId,
  textoObligatorio
} = require('../utils/comun');

const listarCatalogos = async (req, res) => {
  const [
    [tiposCliente],
    [marcas],
    [modelos],
    [categorias],
    [estatus],
    [estadosSolicitud],
    [formasPago],
    [mecanicos]
  ] = await Promise.all([
    pool.query('SELECT id_tipo_cliente, nombre FROM tipo_cliente ORDER BY id_tipo_cliente'),
    pool.query('SELECT id_marca, nombre FROM marca ORDER BY nombre'),
    pool.query('SELECT id_modelo, id_marca, nombre FROM modelo ORDER BY nombre'),
    pool.query(
      `SELECT c.id_categoria, c.nombre, c.descripcion, c.activa,
              g.nombre AS garantia, g.dias AS garantia_dias
       FROM categoria_servicio c
       INNER JOIN tipo_garantia g ON g.id_tipo_garantia = c.id_tipo_garantia
       ORDER BY c.nombre`
    ),
    pool.query('SELECT id_estatus, nombre, secuencia, color_hex FROM estatus_orden ORDER BY secuencia'),
    pool.query('SELECT id_estado_solicitud, nombre FROM estado_solicitud ORDER BY id_estado_solicitud'),
    pool.query('SELECT id_forma_pago, nombre FROM forma_pago ORDER BY id_forma_pago'),
    pool.execute(
      `SELECT id_usuario, nombre_completo
       FROM usuario
       WHERE id_rol = ? AND activo = 1
       ORDER BY nombre_completo`,
      [ROLES.MECANICO]
    )
  ]);

  res.json({
    ok: true,
    tiposCliente,
    marcas,
    modelos,
    categorias,
    estatus,
    estadosSolicitud,
    formasPago,
    mecanicos
  });
};

const crearMarca = async (req, res) => {
  const nombre = textoObligatorio(req.body?.nombre, 2, 40, 'El nombre de la marca');

  const [resultado] = await pool.execute(
    'INSERT INTO marca (nombre) VALUES (?)',
    [nombre]
  );

  res.status(201).json({
    ok: true,
    mensaje: 'Marca registrada',
    marca: { id_marca: resultado.insertId, nombre }
  });
};

const crearModelo = async (req, res) => {
  const idMarca = exigirId(req.body?.id_marca, 'La marca');
  const nombre = textoObligatorio(req.body?.nombre, 1, 60, 'El nombre del modelo');

  const [marca] = await pool.execute(
    'SELECT id_marca FROM marca WHERE id_marca = ?',
    [idMarca]
  );

  if (marca.length === 0) {
    throw new ErrorApi(404, 'La marca no existe');
  }

  const [resultado] = await pool.execute(
    'INSERT INTO modelo (id_marca, nombre) VALUES (?, ?)',
    [idMarca, nombre]
  );

  res.status(201).json({
    ok: true,
    mensaje: 'Modelo registrado',
    modelo: { id_modelo: resultado.insertId, id_marca: idMarca, nombre }
  });
};

module.exports = {
  listarCatalogos,
  crearMarca,
  crearModelo
};
