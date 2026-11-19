const express = require('express');
const c = require('../controllers/catalogos.controller');
const { verificarToken, permitirRoles } = require('../middleware/auth.middleware');
const { manejar } = require('../utils/comun');

const router = express.Router();
router.use(verificarToken);

router.get('/', manejar(c.listarCatalogos));
router.post('/marcas', permitirRoles('Administrador', 'Cajero'), manejar(c.crearMarca));
router.post('/modelos', permitirRoles('Administrador', 'Cajero'), manejar(c.crearModelo));

module.exports = router;
