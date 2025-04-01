const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');

const dbName = 'gameStart';
const collectionName = 'empleados';

//Crear un empleado
const createEmpleado = async (req, res) => {
  const { cedula, nombre, apellido, fecha_nacimiento, direccion, telefono, correo, puesto, sueldo } = req.body;

  const nuevoEmpleado = {
    cedula,
    nombre,
    apellido,
    fecha_nacimiento,
    direccion,
    telefono,
    correo,
    puesto,
    sueldo,
    fecha_creacion: new Date(),
    estado: 'activo'
  };

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).insertOne(nuevoEmpleado);
    res.status(201).json({ message: 'Empleado creado con éxito', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el empleado', details: error.message });
  }
};

//Obtener todos los empleados
const getAllEmpleados = async (req, res) => {
  try {
    const db = client.db(dbName);
    const empleados = await db.collection(collectionName).find({}).toArray();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los empleados', details: error.message });
  }
};

//Obtener los empleados por ID
const getEmpleadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db(dbName);
    const empleado = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el empleado', details: error.message });
  }
};

// Actualizar empleado
const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const db = client.db(dbName);
    
    // First get the existing employee
    const existingEmpleado = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!existingEmpleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Merge existing data with updates
    const updatedEmpleado = {
      ...existingEmpleado,
      ...req.body
    };

    // Remove _id from the update
    delete updatedEmpleado._id;

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEmpleado }
    );

    res.json({ message: 'Empleado actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el empleado', details: error.message });
  }
};

//Borrar empleado
const deleteEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el empleado', details: error.message });
  }
};

module.exports = {
  createEmpleado,
  getAllEmpleados,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado
};
