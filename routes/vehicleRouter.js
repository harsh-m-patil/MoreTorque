const express = require("express");
const vehicleController = require("../controllers/vehicleController");

const router = express.Router();

router.get("/decode/:vin", vehicleController.decodeVin);

module.exports = router;
