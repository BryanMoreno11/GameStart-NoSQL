const { MongoClient, ObjectId } = require('mongodb');
const client = require('../database');
const { encrypt, compare } = require("../helpers/handleBcrypt");
const { get } = require('mongoose');


const dbName = 'gameStart';
const collectionName = 'clientes';


//obtener cliente por id
const getClienteById = async(req, res) => {
    const { id } = req.params;
    try {
        const db = client.db(dbName);
        const cliente = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        res.json(cliente);

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: error.message });
    }
};


//obtener clientes
const getAllClientes = async(req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const clientes = await db.collection(collectionName).find({}).toArray();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los clientes', details: error.message });
    }
};

//obtener cliente por nombre
const getClienteByNombre = async(req, res) => {
    const { nombre } = req.params;
    try {
        const db = client.db(dbName);
        const cliente = await db.collection(collectionName).findOne({ nombre });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: error.message });
    }
};

//obtener cliente login
const getClienteLogin = async(req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const db = client.db(dbName);
        const cliente = await db.collection(collectionName).findOne({ correo: correo });
        if (cliente) {
            const passwordMatch = await compare(contrasenia, cliente.passwordHash);
            if (passwordMatch) {
                res.status(200).json({
                    success: true,
                    message: 'Login Exitoso',
                    id: cliente._id,
                    nombre: cliente.nombre
                });
            } else {
                res.status(401).json({ error: 'Correo o contrasenia incorrecto' });
            }
        } else {
            res.status(404).json({ error: 'No existe el cliente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: error.message });
    }
}

const verifyLogin = async(req, res) => {
    const { plainPassword, hashedPassword } = req.body;
    const passwordHash = await compare(plainPassword, hashedPassword);
    if (passwordHash) {
        return true;
    } else {
        return false;
    }
}

//crear un cliente
const createCliente = async(req, res) => {
    const { id_ciudad, cedula, nombre, apellido, fecha_nacimiento, telefono, correo, contrasenia } = req.body;
    const passwordHash = await encrypt(contrasenia);
    const nuevoCliente = {
        id_ciudad,
        cedula,
        nombre,
        apellido,
        fecha_nacimiento,
        telefono,
        correo,
        passwordHash
    };

    try {
        const db = client.db(dbName);
        const result = await db.collection(collectionName).insertOne(nuevoCliente);
        res.status(201).json({ message: 'Cliente creado con éxito', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el cliente', details: error.message });
    }
};

module.exports = {
    getAllClientes,
    getClienteByNombre,
    getClienteById,
    getClienteLogin,
    createCliente,
    verifyLogin

}