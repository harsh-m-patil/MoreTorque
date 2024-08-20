const express = require("express");
const rateLimit = require("express-rate-limit");
const vehicleController = require("../controllers/vehicleController");

const router = express.Router();

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 1000,
  message: "Too many Requests from this IP,try again in a minute",
});

router.get("/decode/:vin", limiter, vehicleController.decodeVin);
router.get("/", vehicleController.getVehicles);
router.get("/:vin", vehicleController.getVehicles);
router.post("/", vehicleController.createVehicle);

module.exports = router;
