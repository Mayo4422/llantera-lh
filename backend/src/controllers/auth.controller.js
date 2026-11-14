
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const iniciarSesion = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body || {};

    if (
      typeof usuario !== 'string' ||
      typeof contrasena !== 'string' ||
      !usuario.trim() ||
      !contrasena
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Usuario y contraseña son obligatorios'
      });
    }

    const [usuarios] = await pool.execute(
      `SELECT
         u.id_usuario,
         u.nombre_completo,
         u.usuario,
         u.contrasena_hash,
         u.activo,
         u.debe_cambiar_contrasena,
         r.nombre AS rol
       FROM usuario u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.usuario = ?
       LIMIT 1`,
      [usuario.trim()]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    const usuarioBD = usuarios[0];

    if (!usuarioBD.activo) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Usuario desactivado'
      });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuarioBD.contrasena_hash
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }

    const token = jwt.sign(
      { id_usuario: usuarioBD.id_usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '2h' }
    );

    await pool.execute(
      'UPDATE usuario SET ultimo_acceso = NOW() WHERE id_usuario = ?',
      [usuarioBD.id_usuario]
    );

    return res.json({
      ok: true,
      mensaje: 'Inicio de sesión correcto',
      token,
      usuario: {
        id_usuario: usuarioBD.id_usuario,
        nombre_completo: usuarioBD.nombre_completo,
        usuario: usuarioBD.usuario,
        rol: usuarioBD.rol,
        debe_cambiar_contrasena:
          Boolean(usuarioBD.debe_cambiar_contrasena)
      }
    });
  } catch (error) {
    console.error('Error de autenticación:', error.message);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = { iniciarSesion };
