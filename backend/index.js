const express = require("express");
const app = express();
const cors = require("cors");



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
const productosRoutes = require("./Routes/productosRoutes");
app.use("/api", productosRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
