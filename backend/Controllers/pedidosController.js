const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');
const dbName = 'gameStart';
const collectionName = 'pedidos'; // Ahora trabajaremos con la colección de pedidos

// Obtener todos los pedidos
async function getPedidos(req, res) {
    try {
        const database = client.db(dbName);
        const pedidosCollection = database.collection(collectionName);

        // Consulta de todos los pedidos
        const result = await pedidosCollection.find({}).toArray();

        res.json(result);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Insertar un nuevo pedido
async function addPedido(req, res) {
    try {
        const { proveedor, producto, precio_unitario, cantidad, descuento, total, fecha_pedido } = req.body;
        console.log("Datos recibidos para insertar:", req.body);

        // Validamos que los datos clave estén presentes
        if (!proveedor || !producto || !precio_unitario || !cantidad || !total) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Conectamos a la base de datos
        const database = client.db(dbName);
        const pedidosCollection = database.collection(collectionName);

        // Normalizamos los datos antes de insertar
        const nuevoPedido = {
            proveedor: {
                _id: new ObjectId(proveedor._id), // Convertimos a ObjectId si es necesario
                nombre: proveedor.nombre || "",
                celular: proveedor.celular || "",
                correo: proveedor.correo || "",
                direccion: proveedor.direccion || "",
                fecha_creacion: proveedor.fecha_creacion ? new Date(proveedor.fecha_creacion) : new Date(),
            },
            producto: {
                _id: producto._id !== "-1" ? new ObjectId(producto._id) : new ObjectId(),
                nombre: producto.nombre || "",
                desarrolladora: producto.desarrolladora || "",
                plataforma: {
                    nombre: producto.plataforma.nombre || "",
                    descripcion: producto.plataforma.descripcion || "",
                    fecha_creacion: producto.plataforma.fecha_creacion ? new Date(producto.plataforma.fecha_creacion) : new Date(),
                },
                genero: {
                    nombre: producto.genero.nombre || "",
                    descripcion: producto.genero.descripcion || "",
                    fecha_creacion: producto.genero.fecha_creacion ? new Date(producto.genero.fecha_creacion) : new Date(),
                },
                tipo: {
                    nombre: producto.tipo.nombre || "",
                    descripcion: producto.tipo.descripcion || "",
                    fecha_creacion: producto.tipo.fecha_creacion ? new Date(producto.tipo.fecha_creacion) : new Date(),
                },
                precio: producto.precio || 0,
                stock: producto.stock || 0,
                imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [],
                fecha_creacion: producto.fecha_creacion ? new Date(producto.fecha_creacion) : new Date(),
                descripcion: producto.descripcion || "",
                claves_digitales: producto.claves_digitales || null,
            },
            precio_unitario,
            cantidad,
            descuento: descuento || 0,
            total,
            fecha_pedido: fecha_pedido ? new Date(fecha_pedido) : new Date(),
        };

        // Insertamos el pedido en la colección
        const result = await pedidosCollection.insertOne(nuevoPedido);

        // Respuesta con el ID del pedido insertado
        res.json({ id_pedido: result.insertedId });
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}


// Modificar un pedido existente
async function updatePedido(req, res) {
    try {
        const pedidoId = req.params.id;
        const { proveedor, producto, precio_unitario, cantidad, descuento, total, fecha_pedido } = req.body;

        // Buscar el pedido existente en la base de datos
        const database = client.db(dbName);
        const pedidosCollection = database.collection('pedidos');
        const pedidoExistente = await pedidosCollection.findOne({ _id: new ObjectId(pedidoId) });

        if (!pedidoExistente) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        // Construcción de la actualización con la misma estructura que addPedido
        const actualizacion = {
            proveedor: {
                _id: new ObjectId(proveedor._id),
                nombre: proveedor.nombre || pedidoExistente.proveedor.nombre,
                celular: proveedor.celular || pedidoExistente.proveedor.celular,
                correo: proveedor.correo || pedidoExistente.proveedor.correo,
                direccion: proveedor.direccion || pedidoExistente.proveedor.direccion,
                fecha_creacion: pedidoExistente.proveedor.fecha_creacion || new Date()
            },
            producto: {
                _id: producto._id !== "-1" ? new ObjectId(producto._id) : new ObjectId(),
                nombre: producto.nombre || pedidoExistente.producto.nombre,
                desarrolladora: producto.desarrolladora || pedidoExistente.producto.desarrolladora,
                plataforma: {
                    nombre: producto.plataforma.nombre || pedidoExistente.producto.plataforma.nombre,
                    descripcion: producto.plataforma.descripcion || pedidoExistente.producto.plataforma.descripcion,
                    fecha_creacion: producto.plataforma.fecha_creacion ? new Date(producto.plataforma.fecha_creacion) : pedidoExistente.producto.plataforma.fecha_creacion
                },
                genero: {
                    nombre: producto.genero.nombre || pedidoExistente.producto.genero.nombre,
                    descripcion: producto.genero.descripcion || pedidoExistente.producto.genero.descripcion,
                    fecha_creacion: producto.genero.fecha_creacion ? new Date(producto.genero.fecha_creacion) : pedidoExistente.producto.genero.fecha_creacion
                },
                tipo: {
                    nombre: producto.tipo.nombre || pedidoExistente.producto.tipo.nombre,
                    descripcion: producto.tipo.descripcion || pedidoExistente.producto.tipo.descripcion,
                    fecha_creacion: producto.tipo.fecha_creacion ? new Date(producto.tipo.fecha_creacion) : pedidoExistente.producto.tipo.fecha_creacion
                },
                precio: producto.precio || pedidoExistente.producto.precio,
                stock: producto.stock || pedidoExistente.producto.stock,
                imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : pedidoExistente.producto.imagenes,
                fecha_creacion: producto.fecha_creacion ? new Date(producto.fecha_creacion) : pedidoExistente.producto.fecha_creacion,
                descripcion: producto.descripcion || pedidoExistente.producto.descripcion,
                claves_digitales: producto.claves_digitales || pedidoExistente.producto.claves_digitales
            },
            precio_unitario,
            cantidad,
            descuento: descuento || 0,
            total,
            fecha_pedido: fecha_pedido ? new Date(fecha_pedido) : pedidoExistente.fecha_pedido
        };

        // Realizar la actualización en MongoDB
        const resultado = await pedidosCollection.updateOne({ _id: new ObjectId(pedidoId) }, { $set: actualizacion });

        if (resultado.modifiedCount === 0) {
            return res.status(200).json({ mensaje: `⚠️ No se realizaron cambios en el pedido ${pedidoId}` });
        }

        res.status(200).json({ mensaje: "✅ Pedido actualizado correctamente", pedidoId });
    } catch (error) {
        console.error("❌ Error al actualizar el pedido:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}


async function deletePedido(req, res) {
    try {
        const pedidoId = req.params.id;
        const result = await client.db(dbName).collection(collectionName).deleteOne({ _id: new ObjectId(pedidoId) });
        if (result.deletedCount === 1) {
            res.status(200).json({ mensaje: `✅ Pedido ${pedidoId} eliminado correctamente` });
        } else {
            res.status(404).json({ mensaje: `⚠️ Pedido ${pedidoId} no encontrado` });
        }
    } catch (error) {
        console.error("❌ Error al eliminar el pedido:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
}

module.exports = {
    getPedidos,
    addPedido,
    updatePedido,
    deletePedido
};