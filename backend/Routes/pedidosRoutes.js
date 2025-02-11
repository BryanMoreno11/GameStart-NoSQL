const { Router } = require('express');
const router = new Router();
const autheticateToken = require("../middleware/authenticateToken");

const { getPedidos, addPedido, updatePedido, deletePedido } = require('../Controllers/pedidosController');

router.get('/pedidos', autheticateToken.verifyToken, getPedidos);
router.post('/pedidos', addPedido);
router.put('/pedidos/:id', updatePedido);
router.delete('/pedidos/:id', deletePedido);

module.exports = router;