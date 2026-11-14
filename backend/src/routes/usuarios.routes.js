
const express = require('express');

const {
  listarUsuarios,
  consultarUsuario,
  crearUsuario,
  actualizarUsuario,
  cambiarEstado,
  restablecerContrasena
} = require('../controllers/usuarios.controller');

const {
  verificarToken,
  permitirRoles
} = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verificarToken);
router.use(permitirRoles('Administrador'));

router.get('/', listarUsuarios);
router.get('/:id', consultarUsuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.patch('/:id/estado', cambiarEstado);
router.patch(
  '/:id/contrasena',
  restablecerContrasena
);

module.exports = router;
