const { Router } = require("express");
const router = new Router();

var {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  updateStockProducto  // Se añade la función para actualizar el stock
} = require("../Controllers/productosController");

router.post("/productos", createProducto);
router.get("/productos", getAllProductos);
router.get("/productos/:id", getProductoById);
router.put("/productos/:id", updateProducto);
router.put("/productos/:id/stock", updateStockProducto); // Nueva ruta para actualizar stock y claves digitales
router.delete("/productos/:id", deleteProducto);

module.exports = router;
