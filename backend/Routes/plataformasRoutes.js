const { Router } = require("express");
const router = new Router();

var {
  createPlataforma,
  updatePlataforma,
  deletePlataforma,
  getPlataformaById,
  getAllPlataformas
} = require("../Controllers/plataformasController");

router.post("/plataforma", createPlataforma);
router.get("/plataformas", getAllPlataformas);
router.get("/plataforma/:id", getPlataformaById);
router.put("/plataforma/:id", updatePlataforma);
router.delete("/plataforma/:id", deletePlataforma);

module.exports = router;
