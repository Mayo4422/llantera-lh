const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const verificarToken = async (req, res, next) => {
  const autorizacion = req.headers.authorization || '';
  const [tipo, token] = autorizacion.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token de autenticación requerido'
    });
  }

  let datos;

  try {
    datos = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado'
    });
  }

  try {

    const [usuarios] = await pool.execute(
      `SELECT
          u.id_usuario,
          u.nombre_completo,
          u.usuario,
          u.activo,
          u.debe_cambiar_contrasena,
          u.version_token,
          r.nombre AS rol
       FROM usuario u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = ?`,
      [datos.id_usuario]
    );

    if (
      usuarios.length === 0 ||
      Number(usuarios[0].activo) !== 1
    ) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Sesión no válida'
      });
    }

    const usuario = usuarios[0];

    if (
      !Number.isInteger(datos.version_token) ||
      datos.version_token !== Number(usuario.version_token)
    ) {
      return res.status(401).json({
        ok: false,
        codigo: 'SESION_INVALIDADA',
        mensaje: 'Tu sesión ya no es válida. Inicia sesión nuevamente.'
      });
    }

    req.usuario = usuario;

    const rutasPermitidas = [
      '/api/auth/perfil',
      '/api/auth/cambiar-contrasena'
    ];

    if (
      Number(usuario.debe_cambiar_contrasena) === 1 &&
      !rutasPermitidas.includes(
        req.originalUrl.split('?')[0]
      )
    ) {
      return res.status(403).json({
        ok: false,
        codigo: 'CAMBIO_CONTRASENA_REQUERIDO',
        mensaje: 'Debes cambiar tu contraseña antes de continuar'
      });
    }

    next();

  } catch (error) {
    console.error('Error al verificar usuario:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al verificar la sesión'
    });
  }
};

const permitirRoles = (...roles) => {
  return (req, res, next) => {
    if (
      !req.usuario ||
      !roles.includes(req.usuario.rol)
    ) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tienes permisos para esta operación'
      });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  permitirRoles
};
