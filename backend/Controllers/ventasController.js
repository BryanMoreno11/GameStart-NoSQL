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

    const clavesUsuario = []; // Claves digitales asignadas para la venta

    console.log('[createVenta] Procesando venta. Productos recibidos:', productos);

    // Procesar cada producto del carrito
    for (const producto of productos) {
      const productoId = producto._id;
      const cantidadComprada = producto.cantidad;

      // Obtener el producto desde la base de datos
      const productoDb = await productosCollection.findOne({ _id: new ObjectId(productoId) });
      if (!productoDb) {
        console.log(`[createVenta] Producto con ID ${productoId} no encontrado.`);
        return res.status(404).json({ error: `Producto con ID ${productoId} no encontrado.` });
      }

      // Verificar stock suficiente
      if (productoDb.stock < cantidadComprada) {
        console.log(`[createVenta] Stock insuficiente para el producto "${productoDb.nombre}". Disponible: ${productoDb.stock}`);
        return res.status(400).json({
          error: `Stock insuficiente para el producto "${productoDb.nombre}". Disponible: ${productoDb.stock}.`,
        });
      }

      // Calcular nuevo stock
      const nuevoStock = productoDb.stock - cantidadComprada;
      console.log(`[createVenta] Producto "${productoDb.nombre}" - cantidad comprada: ${cantidadComprada}, nuevo stock: ${nuevoStock}`);

      // Manejo de claves digitales
      if (productoDb.claves_digitales && productoDb.claves_digitales.length > 0) {
        let clavesDisponibles;
        // Si la clave es objeto, filtramos por "valido"
        if (typeof productoDb.claves_digitales[0] === 'object') {
          clavesDisponibles = productoDb.claves_digitales.filter(clave => clave.valido === true);
        } else {
          // Asumir que son strings y, por tanto, todas son válidas
          clavesDisponibles = productoDb.claves_digitales;
        }

        if (clavesDisponibles.length < cantidadComprada) {
          console.log(`[createVenta] No hay suficientes claves para "${productoDb.nombre}".`);
          return res.status(400).json({
            error: `No hay suficientes claves digitales disponibles para el producto "${productoDb.nombre}".`
          });
        }

        // Selecciona las primeras claves según la cantidad comprada
        const clavesAsignadas = clavesDisponibles.slice(0, cantidadComprada);

        // Actualización de claves: si son objetos, marcarlas como no válidas; si son strings, removerlas del arreglo
        if (typeof productoDb.claves_digitales[0] === 'object') {
          const clavesActualizadas = productoDb.claves_digitales.map(clave => {
            if (clavesAsignadas.find(asignada => asignada.codigo === clave.codigo)) {
              return { ...clave, valido: false };
            }
            return clave;
          });
          await productosCollection.updateOne(
            { _id: new ObjectId(productoId) },
            { $set: { stock: nuevoStock, claves_digitales: clavesActualizadas } }
          );
        } else {
          // Claves como strings: remover las primeras "cantidadComprada" claves
          const nuevasClaves = productoDb.claves_digitales.slice(cantidadComprada);
          await productosCollection.updateOne(
            { _id: new ObjectId(productoId) },
            { $set: { stock: nuevoStock, claves_digitales: nuevasClaves } }
          );
        }

        // Obtener códigos asignados (si son objetos, extraer la propiedad; si son strings, usarlos directamente)
        const clavesAsignadasSoloCodigo = typeof clavesAsignadas[0] === 'object'
          ? clavesAsignadas.map(clave => clave.codigo)
          : clavesAsignadas;

        console.log(`[createVenta] Claves asignadas para "${productoDb.nombre}":`, clavesAsignadasSoloCodigo);

        // Agregar la información de la clave al registro de la venta para el usuario
        clavesUsuario.push({
          productoId: productoDb._id,
          nombre: productoDb.nombre,
          claves: clavesAsignadasSoloCodigo
        });
        // Agregar la propiedad "claves_asignadas" al objeto producto
        producto.claves_asignadas = clavesAsignadasSoloCodigo;
      } else {
        // Producto no digital: se actualiza solo el stock.
        await productosCollection.updateOne(
          { _id: new ObjectId(productoId) },
          { $set: { stock: nuevoStock } }
        );
      }
    }

    // Registrar la venta en la colección de ventas, incluyendo la información de claves asignadas
    const nuevaVenta = {
      cliente,
      fecha_venta: new Date(fecha_venta),
      productos,
      subtotal,
      iva,
      total,
      clavesUsuario
    };

    const result = await ventasCollection.insertOne(nuevaVenta);
    console.log('[createVenta] Venta creada con éxito, id:', result.insertedId);
    res.status(201).json({
      message: "Venta creada con éxito",
      ventaId: result.insertedId,
    });
  } catch (error) {
    console.log('[createVenta] Error:', error);
    res.status(500).json({ error: "Error al crear la venta", details: error.message });
  }
};

const getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db(dbName);
    const venta = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta', details: error.message });
  }
};

module.exports = {
  createVenta,
  getVentaById
};
