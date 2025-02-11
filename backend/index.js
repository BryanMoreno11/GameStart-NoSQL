const express = require("express");
const app = express();
const cors = require("cors");



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
const productosRoutes = require("./Routes/productosRoutes");
const plataformaRoutes = require("./Routes/plataformasRoutes");
const ventaRoutes = require("./Routes/ventaRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const clientesRoutes = require("./Routes/clientesRoutes");
const usuariosRoutes = require('./Routes/usuariosRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const correoRoutes = require('./routes/correoRoutes');
const pedidosRoutes = require('./Routes/pedidosRoutes');
const proveedoresRoutes = require('./Routes/proveedoresRoutes');

app.use("/api", productosRoutes);
app.use("/api", plataformaRoutes);
app.use("/api", ventaRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", correoRoutes);
app.use("/api", clientesRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', verifyRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', proveedoresRoutes);



// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});