const { Router } = require("express");
const router = new Router();

var {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
} = require("../Controllers/productosController");

router.post("/productos", createProducto);
router.get("/productos", getAllProductos);
router.get("/productos/:id", getProductoById);
router.put("/productos/:id", updateProducto);
router.delete("/productos/:id", deleteProducto);

module.exports = router;
