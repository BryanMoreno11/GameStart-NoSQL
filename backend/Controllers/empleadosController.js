const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');

const dbName = 'gameStart';
const collectionName = 'empleados';

// Obtener todos los empleados
async function getEmpleados(req, res) {
    try {
        const db = client.db(dbName);
        const empleados = await db.collection(collectionName).find({}).toArray();
        res.json(empleados);
    } catch (err) {
        console.error('Error al obtener empleados:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Insertar un nuevo empleado
async function addEmpleado(req, res) {
    const { id_sucursal, id_ciudad, id_puesto, cedula, nombre, fecha_nacimiento, direccion, telefono, correo, estado } = req.body;
    console.log('Datos recibidos para insertar:', req.body);
    try {
        const db = client.db(dbName);
        const result = await db.collection(collectionName).insertOne({
            id_sucursal,
            id_ciudad,
            id_puesto,
            cedula,
            nombre,
            fecha_nacimiento: new Date(fecha_nacimiento),
            direccion,
            telefono,
            correo,
            estado,
            fecha_creacion: new Date()
        });
        res.json({ id_empleado: result.insertedId });
    } catch (err) {
        console.error('Error al insertar empleado:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Modificar un empleado existente
async function updateEmpleado(req, res) {
    const { id } = req.params;
    const { id_sucursal, id_ciudad, id_puesto, cedula, nombre, fecha_nacimiento, direccion, telefono, correo, estado } = req.body;
    console.log('Datos recibidos para actualizar:', req.body);
    try {
        const db = client.db(dbName);
        const result = await db.collection(collectionName).updateOne({ _id: new ObjectId(id) }, {
            $set: {
                id_sucursal,
                id_ciudad,
                id_puesto,
                cedula,
                nombre,
                fecha_nacimiento: new Date(fecha_nacimiento),
                direccion,
                telefono,
                correo,
                estado
            }
        });
        res.json({ modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error('Error al actualizar empleado:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
    getEmpleados,
    addEmpleado,
    updateEmpleado
};