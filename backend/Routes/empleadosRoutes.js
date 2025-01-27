const express = require('express');
const router = express.Router();
const empleadosController = require('../Controllers/empleadosController');

// Define routes
router.get('/empleados', empleadosController.getAllEmpleados);
router.get('/empleados/:id', empleadosController.getEmpleadoById);
router.post('/empleados', empleadosController.createEmpleado);
router.put('/empleados/:id', empleadosController.updateEmpleado);
router.delete('/empleados/:id', empleadosController.deleteEmpleado);

module.exports = router;
