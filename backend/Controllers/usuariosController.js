const { MongoClient, ObjectId } = require('mongodb');
const { encrypt, compare } = require("../helpers/handleBcrypt");
const jwt = require('jsonwebtoken');
const SECRET_JWT_KEY = 'prueba';
const speakeasy = require('speakeasy');
const client = require('../database');
const dbName = "gameStart";
const collectionName = "usuarios";

//obtener usuario por ID
async function getUsuario(req, res) {
    const { id } = req.params;
    try {
        const db = client.db(dbName);
        const usuario = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: "No existe el usuario segun el ID" });
        }
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
    }
}

//obtener usuario por correo
async function getUsuarioNombre(req, res) {
    const { nombre } = req.params;

    try {
        const db = client.db(dbName);
        const usuario = await db.collection(collectionName).findOne({ correo: nombre });

        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: "No existe el usuario según el nombre" });
        }
    } catch (err) {
        console.error("Error al obtener usuario por nombre:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

//login de usuario
async function getUsuarioLogin(req, res) {
    console.log(req.body);
    const { correo, contrasenia } = req.body;
    try {
        const db = client.db(dbName);
        const usuario = await db.collection(collectionName).findOne({ correo });

        if (usuario) {
            const passwordMatch = await compare(contrasenia, usuario.passwordHash);
            if (passwordMatch) {
                const accessToken = jwt.sign({ username: usuario._id }, SECRET_JWT_KEY, { expiresIn: '1h' });
                res.status(200).json({ succes: true, message: 'Login exitoso', id_cliente: usuario._id, nombre: usuario.nombre, accessToken });
            } else {
                res.status(401).json({ message: "Nombre de usuario o contraseña incorrecto" });
            }
        } else {
            res.status(404).json({ message: "No existe el usuario" });
        }
    } catch (err) {
        console.error("Error al realizar login:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

//verificar login
async function verifyLogin(req, res) {
    const { plainPassword, hashPassword } = req.body;

    try {
        const passwordMatch = await compare(plainPassword, hashPassword);
        if (passwordMatch) {
            res.status(200).json({ success: true, message: "Contraseña válida" });
        } else {
            res.status(401).json({ message: "Contraseña incorrecta" });
        }
    } catch (err) {
        console.error("Error al verificar contraseña:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

//crear un nuevo usuario
async function createUsuario(req, res) {
    const { nombre, contrasenia, apellido, correo, telefono, rol } = req.body;

    try {
        const passwordHash = await encrypt(contrasenia);
        const secret = speakeasy.generateSecret({ length: 20 }).base32;

        const db = client.db(dbName);
        const resultado = await db.collection(collectionName).insertOne({
            nombre,
            passwordHash,
            apellido,
            correo,
            telefono,
            rol,
            secret
        });

        if (resultado.insertedId) {
            res.status(201).json({ message: "Usuario creado", nombre, secret });
        } else {
            res.status(400).json({ message: "No se pudo guardar el usuario" });
        }
    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

module.exports = {
    getUsuario,
    getUsuarioNombre,
    getUsuarioLogin,
    verifyLogin,
    createUsuario
};