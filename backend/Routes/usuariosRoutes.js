const { Router } = require("express");
const router = new Router();
var { getUsuario, createUsuario, getUsuarioLogin, verifyLogin, getUsuarioNombre } = require('../controllers/usuariosController');
router.get('/usuario/:id', getUsuario);
router.get('/usuarionombre/:nombre', getUsuarioNombre);
router.post('/usuario/login', getUsuarioLogin);
router.get('/usuario/verify', verifyLogin);
router.post('/usuario', createUsuario);
module.exports = router;