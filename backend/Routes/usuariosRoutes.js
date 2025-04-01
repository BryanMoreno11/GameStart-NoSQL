const { Router } = require("express");
const router = new Router();
var { getUsuario, createUsuario, getUsuarioLogin, verifyLogin, getUsuarioNombre, getUsuarioCorreo } = require('../Controllers/usuariosController');
router.get('/usuario/:id', getUsuario);
router.get('/usuariocorreo/:correo', getUsuarioCorreo);
router.post('/usuario/login', getUsuarioLogin);
router.get('/usuario/verify', verifyLogin);
router.post('/usuario', createUsuario);
module.exports = router;