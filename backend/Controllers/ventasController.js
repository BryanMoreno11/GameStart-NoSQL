const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');

const dbName = 'gameStart';
const collectionName = 'ventas';
const collectionProductosName = 'productos';


const createVenta = async (req, res) => {
    const { cliente, fecha_venta, productos, subtotal, iva, total } = req.body;
  
    try {
      const db = client.db(dbName); 
      const productosCollection = db.collection(collectionProductosName);
      const ventasCollection = db.collection(collectionName);
  
      const clavesUsuario = []; // Arreglo para almacenar las claves digitales asignadas al usuario
  
      // Procesar los productos del carrito
      for (const producto of productos) {
        const productoId = producto._id;
        const cantidadComprada = producto.cantidad;
  
        // Obtener el producto actual desde la base de datos
        const productoDb = await productosCollection.findOne({ _id: new ObjectId(productoId) });
  
        if (!productoDb) {
          return res.status(404).json({ error: `Producto con ID ${productoId} no encontrado.` });
        }
  
        // Verificar si hay suficiente stock
        if (productoDb.stock < cantidadComprada) {
          return res.status(400).json({
            error: `Stock insuficiente para el producto "${productoDb.nombre}". Disponible: ${productoDb.stock}.`,
          });
        }
  
        // Actualizar stock
        const nuevoStock = productoDb.stock - cantidadComprada;
  
        // Manejar claves digitales
        if (productoDb.claves_digitales && productoDb.claves_digitales.length > 0) {
          const clavesAsignadas = productoDb.claves_digitales.slice(0, cantidadComprada);
          clavesUsuario.push({
            productoId: productoDb._id,
            nombre: productoDb.nombre,
            claves: clavesAsignadas,
          });
  
          // Reducir las claves digitales del producto
          const nuevasClavesDigitales = productoDb.claves_digitales.slice(cantidadComprada);
  
          // Actualizar el producto en la base de datos
          await productosCollection.updateOne(
            { _id: new ObjectId(productoId) },
            { $set: { stock: nuevoStock, claves_digitales: nuevasClavesDigitales } }
          );
        } else {
          // Si el producto no tiene claves digitales, solo actualizar el stock
          await productosCollection.updateOne(
            { _id: new ObjectId(productoId) },
            { $set: { stock: nuevoStock } }
          );
        }
      }
  
      // Registrar la venta en la colección de ventas
      const nuevaVenta = {
        cliente,
        fecha_venta: new Date(fecha_venta),
        productos,
        subtotal,
        iva,
        total,
        clavesUsuario, // Registrar las claves digitales asignadas
      };
  
      const result = await ventasCollection.insertOne(nuevaVenta);
  
      res.status(201).json({
        message: "Venta creada con éxito",
        ventaId: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al crear la venta", details: error.message });
    }
  };
  
  module.exports={
    createVenta
  }