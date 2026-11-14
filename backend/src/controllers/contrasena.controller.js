
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const cambiarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;

    if (
      typeof contrasenaActual !== 'string' ||
      typeof contrasenaNueva !== 'string' ||
      contrasenaNueva.length < 12 ||
      Buffer.byteLength(contrasenaNueva, 'utf8') > 72
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La nueva contraseña debe tener al menos 12 caracteres y no superar 72 bytes'
      });
    }

    if (contrasenaActual === contrasenaNueva) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La nueva contraseña debe ser diferente de la actual'
      });
    }

    const [filas] = await pool.execute(
      `SELECT contrasena_hash
       FROM usuario
       WHERE id_usuario = ? AND activo = 1`,
      [req.usuario.id_usuario]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    const coincide = await bcrypt.compare(
      contrasenaActual,
      filas[0].contrasena_hash
    );

    if (!coincide) {
      return res.status(401).json({
        ok: false,
        mensaje: 'La contraseña actual es incorrecta'
      });
    }

    const nuevoHash = await bcrypt.hash(contrasenaNueva, 12);

    await pool.execute(
      `UPDATE usuario
       SET contrasena_hash = ?,
           debe_cambiar_contrasena = 0
       WHERE id_usuario = ?`,
      [nuevoHash, req.usuario.id_usuario]
    );

    return res.json({
      ok: true,
      mensaje: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'No se pudo actualizar la contraseña'
    });
  }
};

module.exports = { cambiarContrasena };
