const client = require('../database');

const dbName = 'gameStart';
const ventasCollection = 'ventas';
const pedidosCollection = 'pedidos';
const clientesCollection = 'clientes';
const productosCollection = 'productos';
const empleadosCollection = 'empleados';

// Función para filtrar y transformar los resultados en formato clave-valor
function filtroClaveValor(arreglo, clave, valor) {
    let elemento_result = {};
    for (let elemento of arreglo) {
        elemento_result[elemento[clave]] = elemento[valor];
    }
    return elemento_result;
}

// Top 5 videojuegos por cantidad de ventas
async function topVideojuegosCantidadVentas(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { $group: { _id: "$productos.nombre", cantidad: { $sum: "$productos.cantidad" } } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'cantidad');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 videojuegos por recaudación (con redondeo)
async function topVideojuegosRecaudacion(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { 
                $group: { 
                    _id: "$productos.nombre", 
                    recaudacion: { 
                        $sum: { 
                            $multiply: ["$productos.cantidad", "$productos.precio"] 
                        } 
                    } 
                } 
            },
            { 
                $project: { 
                    _id: 1, 
                    recaudacion: { $round: ["$recaudacion", 2] } 
                } 
            },
            { $sort: { recaudacion: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'recaudacion');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 géneros por cantidad de ventas
async function topGenerosCantidadVentas(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { $group: { _id: "$productos.genero.nombre", cantidad: { $sum: "$productos.cantidad" } } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'cantidad');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function topGenerosRecaudacion(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { 
                $group: { 
                    _id: "$productos.genero.nombre", 
                    recaudacion: { 
                        $sum: { 
                            $multiply: ["$productos.cantidad", "$productos.precio"] 
                        } 
                    } 
                } 
            },
            { 
                $project: { 
                    _id: 1, 
                    recaudacion: { $round: ["$recaudacion", 2] } 
                } 
            },
            { $sort: { recaudacion: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'recaudacion');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 plataformas por cantidad de ventas
async function topPlataformasCantidadVentas(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { $group: { _id: "$productos.plataforma.nombre", cantidad: { $sum: "$productos.cantidad" } } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'cantidad');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 plataformas por recaudación
async function topPlataformasRecaudacion(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { 
                $group: { 
                    _id: "$productos.plataforma.nombre", 
                    recaudacion: { 
                        $sum: { 
                            $multiply: ["$productos.cantidad", "$productos.precio"] 
                        } 
                    } 
                } 
            },
            { 
                $project: { 
                    _id: 1, 
                    recaudacion: { $round: ["$recaudacion", 2] } 
                } 
            },
            { $sort: { recaudacion: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'recaudacion');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 proveedores por cantidad de pedidos
async function cantidadPedidosProveedor(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(pedidosCollection).aggregate([
            { $group: { _id: "$proveedor.nombre", cantidad: { $sum: "$cantidad" } } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'cantidad');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Top 5 proveedores por recaudación de pedidos
async function recaudacionPedidosProveedor(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(pedidosCollection).aggregate([
            { 
                $group: { 
                    _id: "$proveedor.nombre", 
                    total: { $sum: "$total" } 
                } 
            },
            { 
                $project: { 
                    _id: 1, 
                    total: { $round: ["$total", 2] } 
                } 
            },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'total');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}


// Cantidad de ventas por formato (físico o digital)
async function cantidadVentasFormato(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { 
                $group: { 
                    _id: "$productos.tipo.nombre", 
                    cantidad: { $sum: "$productos.cantidad" } 
                } 
            },
            { $sort: { cantidad: -1 } }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'cantidad');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Recaudación por formato (físico o digital)
async function recaudacionFormato(req, res) {
    try {
        const db = client.db(dbName);
        const result = await db.collection(ventasCollection).aggregate([
            { $unwind: "$productos" },
            { 
                $group: { 
                    _id: "$productos.tipo.nombre", 
                    recaudacion: { 
                        $sum: { 
                            $multiply: ["$productos.cantidad", "$productos.precio"] 
                        } 
                    } 
                } 
            },
            { 
                $project: { 
                    _id: 1, 
                    recaudacion: { $round: ["$recaudacion", 2] } 
                } 
            },
            { $sort: { recaudacion: -1 } }
        ]).toArray();

        let resultado = filtroClaveValor(result, '_id', 'recaudacion');
        res.json(resultado);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

async function estadisticasGenerales(req, res) {
    try {
      const db = client.db(dbName);
  
      // Dinero recaudado (suma de todos los totales en ventas)
      const dineroRecaudado = await db.collection(ventasCollection).aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]).toArray();
  
      // Usuarios registrados (contar documentos en la colección clientes)
      const usuariosRegistrados = await db.collection(clientesCollection).countDocuments();
  
      // Cantidad de ventas (contar documentos en la colección ventas)
      const cantidadVentasQuery = await db.collection(ventasCollection).aggregate([
        { $unwind: "$productos" }, 
        { $group: { _id: null, total: { $sum: "$productos.cantidad" } } } // Sumar las cantidades
      ]).toArray();
    const cantidadVentas = cantidadVentasQuery[0].total;  
      // Número de empleados (contar documentos en la colección empleados)
      const numeroEmpleados = await db.collection(empleadosCollection).countDocuments();
  
      // Cantidad de videojuegos disponibles (contar documentos en la colección productos)
      const cantidadVideojuegos = await db.collection(productosCollection).countDocuments();
  
      // Cantidad de videojuegos en físico y digital
      const videojuegosFormato = await db.collection(productosCollection).aggregate([
        { $group: { _id: "$tipo.nombre", cantidad: { $sum: 1 } } }
      ]).toArray();
  
      // Dinero invertido en reabastecimiento (suma de todos los totales en pedidos)
      const dineroInvertido = await db.collection(pedidosCollection).aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]).toArray();
  
      // Formatear los resultados
      const estadisticas = {
        dineroRecaudado: dineroRecaudado[0]?.total || 0,
        usuariosRegistrados,
        cantidadVentas,
        numeroEmpleados,
        cantidadVideojuegos,
        videojuegosFisico: videojuegosFormato.find(item => item._id === "Físico")?.cantidad || 0,
        videojuegosDigital: videojuegosFormato.find(item => item._id === "Digital")?.cantidad || 0,
        dineroInvertido: dineroInvertido[0]?.total || 0,
      };
  
      res.json(estadisticas);
    } catch (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }





module.exports = {
    topVideojuegosCantidadVentas,
    topVideojuegosRecaudacion,
    topGenerosCantidadVentas,
    topGenerosRecaudacion,
    topPlataformasCantidadVentas,
    topPlataformasRecaudacion,
    cantidadPedidosProveedor,
    recaudacionPedidosProveedor,
    cantidadVentasFormato,
    recaudacionFormato,
    estadisticasGenerales
};