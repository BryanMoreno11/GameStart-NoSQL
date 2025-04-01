const { Router } = require("express");
const router = new Router();

var {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  updateStockProducto,  // Ruta existente para actualizar stock y claves digitales
  updateClaveProducto   // Nueva función para actualizar una clave en una posición específica
} = require("../Controllers/productosController");

router.post("/productos", createProducto);
router.get("/productos", getAllProductos);
router.get("/productos/:id", getProductoById);
router.put("/productos/:id", updateProducto);
router.put("/productos/:id/stock", updateStockProducto);
router.put("/productos/:id/claves", updateClaveProducto); // Nueva ruta para actualizar una clave específica
router.delete("/productos/:id", deleteProducto);

module.exports = router;
