const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');

const dbName = 'gameStart';
const collectionName = 'plataformas';

// Crear una plataforma
const createPlataforma = async (req, res) => {
  const { nombre, descripcion, fecha_creacion } = req.body;

  const nuevaPlataforma = {
    nombre,
    descripcion,
    fecha_creacion: new Date(fecha_creacion),
  };

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).insertOne(nuevaPlataforma);
    res.status(201).json({ message: 'Plataforma creada con éxito', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la plataforma', details: error.message });
  }
};

// Obtener todas las plataformas
const getAllPlataformas = async (req, res) => {
  try {
    const db = client.db(dbName);
    const plataformas = await db.collection(collectionName).find({}).toArray();
    res.json(plataformas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar las plataformas', details: error.message });
  }
};

// Obtener una plataforma por ID
const getPlataformaById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db(dbName);
    const plataforma = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }

    res.json(plataforma);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la plataforma', details: error.message });
  }
};

// Actualizar una plataforma
const updatePlataforma = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nombre,
          descripcion,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }

    res.json({ message: 'Plataforma actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la plataforma', details: error.message });
  }
};

// Eliminar una plataforma
const deletePlataforma = async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }

    res.json({ message: 'Plataforma eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la plataforma', details: error.message });
  }
};

module.exports = {
  createPlataforma,
  getAllPlataformas,
  getPlataformaById,
  updatePlataforma,
  deletePlataforma
};
