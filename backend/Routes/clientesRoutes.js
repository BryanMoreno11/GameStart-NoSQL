const { Router } = require("express");
const router = new Router();

var {
    getAllClientes,
    createCliente,
    getClienteById,
    getClienteByNombre,
    getClienteLogin,
    verifyLogin,
    getClienteByToken
} = require("../Controllers/clientesController");

router.get("/clientes", getAllClientes);
router.get("/cliente/:id", getClienteById);
router.get("/clientes/token/", getClienteByToken);
router.get("/cliente/nombre/:nombre", getClienteByNombre);
router.get("/cliente/verify", verifyLogin);
router.post("/cliente/login", getClienteLogin);
router.post("/clientes", createCliente);

module.exports = router;