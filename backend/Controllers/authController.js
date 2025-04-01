const { encrypt } = require("../helpers/handleBcrypt");

const registerCtrl = async(req, res) => {
    try {
        const { nombre, contrasenia, apellido, correo, telefono, rol } = req.body;
        const passwordHash = await encrypt(contrasenia);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
}