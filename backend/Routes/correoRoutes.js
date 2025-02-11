const { Router } = require("express");
const router = new Router();
var { enviarCorreoPrueba } = require('../Controllers/correoController.js');
router.post('/correo/', enviarCorreoPrueba);
module.exports = router;