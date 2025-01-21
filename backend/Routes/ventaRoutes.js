const { Router } = require("express");
const router = new Router();

var {
  createVenta,
  getVentaById
} = require("../Controllers/ventasController");

router.post("/ventas", createVenta);
router.get("/ventas/:id", getVentaById);

module.exports = router;
