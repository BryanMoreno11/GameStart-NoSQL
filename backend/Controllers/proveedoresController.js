const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database'); // Tu configuración de MongoDB

const dbName = 'gameStart';
const collectionName = 'proveedores'; // Nombre de la colección en MongoDB

// Obtener todos los proveedores
async function getProveedores(req, res) {
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.find({}).toArray();
        res.json(result);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Insertar un nuevo proveedor
async function addProveedor(req, res) {
    const { id_ciudad, nombre, celular, correo, direccion, estado } = req.body;
    console.log('Datos recibidos para insertar:', req.body);
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne({
            id_ciudad,
            nombre,
            celular,
            correo,
            direccion,
            estado
        });
        res.json({ id_proveedor: result.insertedId });
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Modificar un proveedor existente
async function updateProveedor(req, res) {
    const { id } = req.params;
    const { id_ciudad, nombre, celular, correo, direccion, estado } = req.body;
    console.log('Datos recibidos para actualizar:', req.body);
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(id) }, // Buscar por ID (ObjectId en MongoDB)
            {
                $set: {
                    id_ciudad,
                    nombre,
                    celular,
                    correo,
                    direccion,
                    estado
                }
            }
        );
        if (result.matchedCount > 0) {
            res.json({ id_proveedor: id });
        } else {
            res.status(404).json({ error: 'Proveedor no encontrado' });
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = {
    getProveedores,
    addProveedor,
    updateProveedor
};