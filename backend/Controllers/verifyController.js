const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const client = require('../database');
const dbName = "gameStart";
const collectionName = "usuarios";
const { ObjectId } = require('mongodb');

async function verify(req, res) {
    console.log('Verificando token...');
    const { auth_token, secret } = req.body;
    console.log('secret:', secret);
    console.log(auth_token, secret);

    try {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: auth_token
        });

        if (verified) {
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false });
        }
    } catch (err) {
        console.error('Error al verificar token:', err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

async function generateQrCode(req, res) {
    const { correo } = req.query;
    console.log("El correo es: ", correo);

    try {
        const db = client.db(dbName);
        const usuarios = db.collection(collectionName);

        const usuario = await usuarios.findOne({ correo: correo });

        if (usuario) {
            const secret = usuario.secret;

            const otpauthUrl = speakeasy.otpauthURL({
                secret: secret,
                label: 'GameStart Authentication',
                encoding: 'base32'
            });

            qrcode.toDataURL(otpauthUrl, (err, data) => {
                if (err) {
                    console.error('Error al generar código QR:', err);
                    res.status(500).json({ error: "Error al generar el código QR" });
                } else {
                    res.json({ qrCode: data });
                }
            });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

module.exports = { verify, generateQrCode };