const { Router } = require("express");
const router = new Router();
var { verify, generateQrCode } = require('../controllers/verifyController');
router.post('/verify', verify);
router.get('/generate-qr', generateQrCode);
module.exports = router;