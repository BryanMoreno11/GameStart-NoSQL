const { Router } = require('express');
const router = new Router();
const { getEmpleados, addEmpleado, updateEmpleado } = require('../Controllers/empleadosController');

router.get('/empleados', getEmpleados);
router.post('/empleados', addEmpleado);
router.put('/empleados/:id', updateEmpleado);

module.exports = router;