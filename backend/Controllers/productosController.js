const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');
const crypto = require('crypto');

const dbName = 'gameStart';
const collectionName = 'productos';

const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Genera una clave en formato Steam y la retorna como string.
 * Ejemplo: "X7B9D-4Q2ZR-AL3T8"
 * @param {number} groups Número de grupos (por defecto 3).
 * @param {number} groupLength Longitud de cada grupo (por defecto 5).
 * @returns {string} Clave generada.
 */
const generateSteamKey = (groups = 3, groupLength = 5) => {
  let key = '';
  for (let i = 0; i < groups; i++) {
    let group = '';
    for (let j = 0; j < groupLength; j++) {
      const randomIndex = crypto.randomInt(0, allowedChars.length);
      group += allowedChars[randomIndex];
    }
    key += group;
    if (i < groups - 1) {
      key += '-';
    }
  }
  return key;
};

/**
 * Genera un arreglo de claves en formato Steam (cada clave es un string).
 * @param {number} quantity Cantidad de claves a generar.
 * @param {number} groups Número de grupos (por defecto 3).
 * @param {number} groupLength Longitud de cada grupo (por defecto 5).
 * @returns {string[]} Arreglo de claves.
 */
const generateKeys = (quantity, groups = 3, groupLength = 5) => {
  const keys = [];
  for (let i = 0; i < quantity; i++) {
    keys.push(generateSteamKey(groups, groupLength));
  }
  return keys;
};

// Crear un videojuego
const createProducto = async (req, res) => {
  const {
    nombre,
    desarrolladora,
    plataforma,
    genero,
    tipo,
    precio,
    stock,
    claves_digitales,
    imagenes,
    descripcion,
    fecha_creacion
  } = req.body;

  let nuevoVideojuego = {
    nombre,
    desarrolladora,
    plataforma,
    genero,
    tipo,
    precio,
    stock,
    claves_digitales, // inicialmente puede venir vacío
    imagenes,
    descripcion,
    fecha_creacion: new Date(fecha_creacion)
  };

  // Si el producto es digital, genera automáticamente las claves según el stock.
  if (tipo && tipo.nombre === 'Digital') {
    const cantidadClaves = Number(stock) || 0;
    nuevoVideojuego.claves_digitales = generateKeys(cantidadClaves, 3, 5);
    console.log(`[createProducto] Producto Digital. Se generaron ${cantidadClaves} claves:`, nuevoVideojuego.claves_digitales);
  } else {
    console.log('[createProducto] Producto no digital.');
  }

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).insertOne(nuevoVideojuego);
    console.log('[createProducto] Videojuego creado con éxito, id:', result.insertedId);
    res.status(201).json({ message: 'Videojuego creado con éxito', id: result.insertedId });
  } catch (error) {
    console.log('[createProducto] Error:', error);
    res.status(500).json({ error: 'Error al crear el videojuego', details: error.message });
  }
};

// Función para actualizar el stock y ajustar las claves digitales (sólo para productos digitales).
// Se asume que el arreglo de claves contienen solo las claves disponibles.
const updateStockProducto = async (req, res) => {
  const { id } = req.params; // ID del producto a modificar
  const { newStock } = req.body; // Nuevo stock deseado

  try {
    const db = client.db(dbName);
    const producto = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

    if (!producto) {
      console.log('[updateStockProducto] Producto no encontrado, id:', id);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Para productos no digitales solo se actualiza el stock.
    if (!producto.tipo || producto.tipo.nombre !== 'Digital' || !Array.isArray(producto.claves_digitales)) {
      await db.collection(collectionName).updateOne(
        { _id: new ObjectId(id) },
        { $set: { stock: newStock } }
      );
      console.log('[updateStockProducto] Producto no digital, stock actualizado a', newStock);
      return res.json({ message: 'Stock actualizado correctamente' });
    }

    // Para productos digitales:
    const currentKeys = producto.claves_digitales || [];
    const currentCount = currentKeys.length;
    console.log(`[updateStockProducto] Producto digital actual. Stock/claves actuales: ${producto.stock}/${currentCount}`);

    let updatedKeys;
    if (newStock > currentCount) {
      // Si se incrementa el stock: generar nuevas claves y concatenarlas.
      const diff = newStock - currentCount;
      const newKeys = generateKeys(diff, 3, 5);
      updatedKeys = currentKeys.concat(newKeys);
      console.log(`[updateStockProducto] Se incrementó el stock. Se agregaron ${diff} nuevas claves.`);
    } else if (newStock < currentCount) {
      // Si se disminuye el stock: conservar solo las primeras newStock claves.
      updatedKeys = currentKeys.slice(0, newStock);
      console.log(`[updateStockProducto] Se disminuyó el stock. Se conservaron ${newStock} claves.`);
    } else {
      updatedKeys = currentKeys;
      console.log('[updateStockProducto] El stock no cambió.');
    }

    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { stock: newStock, claves_digitales: updatedKeys } }
    );

    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    console.log('[updateStockProducto] Error:', error);
    res.status(500).json({ error: 'Error al actualizar el stock', details: error.message });
  }
};

const getAllProductos = async (req, res) => {
  try {
    const db = client.db(dbName);
    const videojuegos = await db.collection(collectionName).find({}).sort({ nombre: 1 }).toArray();
    res.json(videojuegos);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los videojuegos', details: error.message });
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db(dbName);
    const videojuego = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!videojuego) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    res.json(videojuego);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el videojuego', details: error.message });
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, desarrolladora, plataforma, genero, tipo, precio, stock, claves_digitales, imagenes, descripcion } = req.body;
  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nombre,
          desarrolladora,
          plataforma,
          genero,
          tipo,
          precio,
          stock,
          claves_digitales,
          imagenes,
          descripcion,
        }
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    res.json({ message: 'Videojuego actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el videojuego', details: error.message });
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Videojuego no encontrado' });
    }
    res.json({ message: 'Videojuego eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el videojuego', details: error.message });
  }
};

const updateClaveProducto = async (req, res) => {
  const { id } = req.params; // ID del producto
  const { index, newClave } = req.body; // índice de la clave a modificar y su nuevo valor

  try {
    const db = client.db(dbName);
    const producto = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!producto.claves_digitales || !Array.isArray(producto.claves_digitales)) {
      return res.status(400).json({ error: 'El producto no tiene claves digitales asignadas' });
    }

    if (index < 0 || index >= producto.claves_digitales.length) {
      return res.status(400).json({ error: 'Índice fuera de rango' });
    }

    // Actualizar solo la clave en la posición especificada sin cambiar el orden
    const updatedKeys = [...producto.claves_digitales];
    updatedKeys[index] = newClave;

    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { claves_digitales: updatedKeys } }
    );

    res.json({ message: 'Clave actualizada correctamente', claves_digitales: updatedKeys });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la clave', details: error.message });
  }
};

module.exports = {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  updateStockProducto,
  updateClaveProducto
};