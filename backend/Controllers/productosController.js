const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');

const dbName = 'gameStart';
const collectionName = 'productos';

// Crear un videojuego
const createProducto = async (req, res) => {
  const { nombre, desarrolladora, plataforma, genero, tipo, precio, stock, claves_digitales, imagenes, descripcion, fecha_creacion } = req.body;

  const nuevoVideojuego = {
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
    fecha_creacion: new Date(fecha_creacion)
  };

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).insertOne(nuevoVideojuego);
    res.status(201).json({ message: 'Videojuego creado con éxito', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el videojuego', details: error.message });
  }
};

// Obtener todos los videojuegos
const getAllProductos = async (req, res) => {
  try {
    const db = client.db(dbName);
    const videojuegos = await db.collection(collectionName).find({}).toArray();
    res.json(videojuegos);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los videojuegos', details: error.message });
  }
};

// Obtener un videojuego por ID
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

// Actualizar un videojuego
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

// Eliminar un videojuego
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

module.exports = {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto
};
