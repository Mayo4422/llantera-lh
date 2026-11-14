
const express = require('express');
const { iniciarSesion } = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = express.Router();
const {
  cambiarContrasena
} = require('../controllers/contrasena.controller');

router.post('/login', iniciarSesion);

router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    ok: true,
    usuario: {
      id_usuario: req.usuario.id_usuario,
      nombre_completo: req.usuario.nombre_completo,
      usuario: req.usuario.usuario,
      rol: req.usuario.rol,
      debe_cambiar_contrasena:
        Boolean(req.usuario.debe_cambiar_contrasena)
    }
  });
});

router.patch(
  '/cambiar-contrasena',
  verificarToken,
  cambiarContrasena
);

module.exports = router;