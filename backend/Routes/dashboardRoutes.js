const { Router } = require("express");
const router = new Router();

var {
    topVideojuegosCantidadVentas,
    topVideojuegosRecaudacion,
    topGenerosCantidadVentas,
    topGenerosRecaudacion,
    topPlataformasCantidadVentas,
    topPlataformasRecaudacion,
    cantidadPedidosProveedor,
    recaudacionPedidosProveedor,
    cantidadVentasFormato,
    recaudacionFormato
} = require("../Controllers/dashboardController");


// Rutas de videojuegos
router.get("/dashboard/videojuegos/ventas", topVideojuegosCantidadVentas);
router.get("/dashboard/videojuegos/recaudacion", topVideojuegosRecaudacion);

// Rutas de géneros
router.get("/dashboard/generos/ventas", topGenerosCantidadVentas);
router.get("/dashboard/generos/recaudacion", topGenerosRecaudacion);

// Rutas de plataformas
router.get("/dashboard/plataformas/ventas", topPlataformasCantidadVentas);
router.get("/dashboard/plataformas/recaudacion", topPlataformasRecaudacion);

// Rutas de proveedores
router.get("/dashboard/proveedores/cantidad", cantidadPedidosProveedor);
router.get("/dashboard/proveedores/recaudacion", recaudacionPedidosProveedor);
//Rutas de formato
router.get("/dashboard/formato/cantidad", cantidadVentasFormato);
router.get("/dashboard/formato/recaudacion", recaudacionFormato);




module.exports = router;
