const express = require('express');
const c = require('../controllers/vehiculos.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const { manejar } = require('../utils/comun');

const router = express.Router();
router.use(verificarToken);
router.use(permitirRoles('Administrador', 'Cajero'));

router.get('/', manejar(c.listarVehiculos));
router.get('/:id', manejar(c.consultarVehiculo));
router.post('/', manejar(c.crearVehiculo));
router.put('/:id', manejar(c.actualizarVehiculo));
router.patch('/:id/estado', manejar(c.cambiarEstadoVehiculo));

module.exports = router;
