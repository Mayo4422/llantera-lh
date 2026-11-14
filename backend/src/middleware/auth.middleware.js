
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

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);

        const [usuarios] = await pool.execute(
            `SELECT
         u.id_usuario,
         u.usuario,
         u.nombre_completo,
         u.activo,
         u.debe_cambiar_contrasena,
         r.nombre AS rol
       FROM usuario u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       WHERE u.id_usuario = ?
       LIMIT 1`,
            [datos.id_usuario]
        );

        if (usuarios.length === 0 || !usuarios[0].activo) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Sesión no válida'
            });
        }

        req.usuario = usuarios[0];
        const rutasPermitidas = [
            '/api/auth/perfil',
            '/api/auth/cambiar-contrasena'
        ];

        if (
            Number(req.usuario.debe_cambiar_contrasena) === 1 &&
            !rutasPermitidas.includes(req.originalUrl.split('?')[0])
        ) {
            return res.status(403).json({
                ok: false,
                codigo: 'CAMBIO_CONTRASENA_REQUERIDO',
                mensaje: 'Debes cambiar tu contraseña antes de continuar'
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token inválido o expirado'
        });
    }
};

const permitirRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                ok: false,
                mensaje: 'No tienes permisos para esta operación'
            });
        }

        next();
    };
};

module.exports = { verificarToken, permitirRoles };
