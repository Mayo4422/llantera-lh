
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const CAMPOS_USUARIO = `
  u.id_usuario,
  u.nombre_completo,
  u.usuario,
  u.id_rol,
  r.nombre AS rol,
  u.activo,
  u.debe_cambiar_contrasena,
  u.ultimo_acceso,
  u.fecha_creacion
`;

const responderError = (res, error) => {
  console.error('Error en usuarios:', error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      ok: false,
      mensaje: 'El nombre de usuario ya está registrado'
    });
  }

  return res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor'
  });
};

const idValido = (valor) => {
  const numero = Number(valor);

  return Number.isSafeInteger(numero) &&
    numero > 0 &&
    numero <= 4294967295;
};

const validarNombre = (nombre) =>
  typeof nombre === 'string' &&
  nombre.trim().length >= 3 &&
  nombre.trim().length <= 100;

const validarUsuario = (usuario) =>
  typeof usuario === 'string' &&
  /^[a-zA-Z0-9._-]{3,30}$/.test(usuario);

const validarContrasena = (contrasena) =>
  typeof contrasena === 'string' &&
  contrasena.length >= 12 &&
  Buffer.byteLength(contrasena, 'utf8') <= 72;

const obtenerUsuario = async (id) => {
  const [filas] = await pool.execute(
    `SELECT ${CAMPOS_USUARIO}
     FROM usuario u
     INNER JOIN rol r ON r.id_rol = u.id_rol
     WHERE u.id_usuario = ?`,
    [id]
  );

  return filas[0] || null;
};

const rolExistente = async (idRol) => {
  const [filas] = await pool.execute(
    'SELECT id_rol FROM rol WHERE id_rol = ?',
    [idRol]
  );

  return filas.length > 0;
};

const listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.execute(
      `SELECT ${CAMPOS_USUARIO}
       FROM usuario u
       INNER JOIN rol r ON r.id_rol = u.id_rol
       ORDER BY u.id_usuario ASC`
    );

    return res.json({
      ok: true,
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    return responderError(res, error);
  }
};

const consultarUsuario = async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID de usuario inválido'
      });
    }

    const usuario = await obtenerUsuario(
      Number(req.params.id)
    );

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    return res.json({ ok: true, usuario });
  } catch (error) {
    return responderError(res, error);
  }
};

const crearUsuario = async (req, res) => {
  try {
    const {
      nombre_completo,
      usuario,
      contrasena,
      id_rol
    } = req.body;

    const nombre = nombre_completo?.trim();
    const nombreUsuario = usuario?.trim();
    const rol = Number(id_rol);

    if (!validarNombre(nombre) ||
        !validarUsuario(nombreUsuario) ||
        !validarContrasena(contrasena) ||
        !Number.isInteger(rol) ||
        rol < 1 || rol > 255) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Datos inválidos. La contraseña debe tener al menos 12 caracteres y no superar 72 bytes'
      });
    }

    if (!(await rolExistente(rol))) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El rol seleccionado no existe'
      });
    }

    const hash = await bcrypt.hash(contrasena, 12);

    const [resultado] = await pool.execute(
      `INSERT INTO usuario
       (
         nombre_completo,
         usuario,
         contrasena_hash,
         id_rol,
         activo,
         debe_cambiar_contrasena
       )
       VALUES (?, ?, ?, ?, 1, 1)`,
      [nombre, nombreUsuario, hash, rol]
    );

    const nuevoUsuario = await obtenerUsuario(
      resultado.insertId
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado correctamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    return responderError(res, error);
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!idValido(req.params.id)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID de usuario inválido'
      });
    }

    const actual = await obtenerUsuario(id);

    if (!actual) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const {
      nombre_completo,
      usuario,
      id_rol
    } = req.body;

    const nombre = nombre_completo?.trim();
    const nombreUsuario = usuario?.trim();
    const rol = Number(id_rol);

    if (!validarNombre(nombre) ||
        !validarUsuario(nombreUsuario) ||
        !Number.isInteger(rol) ||
        rol < 1 || rol > 255) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Los datos del usuario son inválidos'
      });
    }

    if (!(await rolExistente(rol))) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El rol seleccionado no existe'
      });
    }

    if (id === req.usuario.id_usuario &&
        rol !== actual.id_rol) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No puedes cambiar tu propio rol'
      });
    }

    await pool.execute(
      `UPDATE usuario
       SET nombre_completo = ?,
           usuario = ?,
           id_rol = ?
       WHERE id_usuario = ?`,
      [nombre, nombreUsuario, rol, id]
    );

    return res.json({
      ok: true,
      mensaje: 'Usuario actualizado correctamente',
      usuario: await obtenerUsuario(id)
    });
  } catch (error) {
    return responderError(res, error);
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!idValido(req.params.id) ||
        typeof req.body.activo !== 'boolean') {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID o estado inválido'
      });
    }

    const actual = await obtenerUsuario(id);

    if (!actual) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    if (id === req.usuario.id_usuario &&
        req.body.activo === false) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No puedes desactivar tu propia cuenta'
      });
    }

    await pool.execute(
      'UPDATE usuario SET activo = ? WHERE id_usuario = ?',
      [req.body.activo ? 1 : 0, id]
    );

    return res.json({
      ok: true,
      mensaje: req.body.activo
        ? 'Usuario activado correctamente'
        : 'Usuario desactivado correctamente',
      usuario: await obtenerUsuario(id)
    });
  } catch (error) {
    return responderError(res, error);
  }
};

const restablecerContrasena = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { contrasena } = req.body;

    if (!idValido(req.params.id) ||
        !validarContrasena(contrasena)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID o contraseña inválidos'
      });
    }

    if (id === req.usuario.id_usuario) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Utiliza el cambio de contraseña personal para tu propia cuenta'
      });
    }

    const actual = await obtenerUsuario(id);

    if (!actual) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const hash = await bcrypt.hash(contrasena, 12);

    await pool.execute(
      `UPDATE usuario
       SET contrasena_hash = ?,
           debe_cambiar_contrasena = 1
       WHERE id_usuario = ?`,
      [hash, id]
    );

    return res.json({
      ok: true,
      mensaje: 'Contraseña restablecida. El usuario deberá cambiarla al iniciar sesión'
    });
  } catch (error) {
    return responderError(res, error);
  }
};

module.exports = {
  listarUsuarios,
  consultarUsuario,
  crearUsuario,
  actualizarUsuario,
  cambiarEstado,
  restablecerContrasena
};
