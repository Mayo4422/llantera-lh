const express = require('express');
const c = require('../controllers/clientes.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const { manejar } = require('../utils/comun');

const router = express.Router();
router.use(verificarToken);
router.use(permitirRoles('Administrador', 'Cajero'));

router.get('/', manejar(c.listarClientes));
router.get('/:id', manejar(c.consultarCliente));
router.post('/', manejar(c.crearCliente));
router.put('/:id', manejar(c.actualizarCliente));
router.patch('/:id/estado', manejar(c.cambiarEstadoCliente));

module.exports = router;
