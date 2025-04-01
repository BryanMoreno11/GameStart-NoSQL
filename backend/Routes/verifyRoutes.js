const { Router } = require("express");
const router = new Router();
var { verify, generateQrCode } = require('../Controllers/verifyController');
router.post('/verify', verify);
router.get('/generate-qr', generateQrCode);
module.exports = router;