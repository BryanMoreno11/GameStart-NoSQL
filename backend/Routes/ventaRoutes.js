const { Router } = require("express");
const router = new Router();

var {
  createVenta
} = require("../Controllers/ventasController");

router.post("/ventas", createVenta);
module.exports = router;
