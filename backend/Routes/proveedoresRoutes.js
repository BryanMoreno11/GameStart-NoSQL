const { Router } = require('express');
const router = new Router();
const { getProveedores, addProveedor, updateProveedor } = require('../Controllers/proveedoresController');

router.get('/proveedores', getProveedores);
router.post('/proveedores', addProveedor);
router.put('/proveedores/:id', updateProveedor);

module.exports = router;