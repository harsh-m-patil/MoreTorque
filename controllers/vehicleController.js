const axios = require("axios");
const Vehicle = require("../models/vehicleModel");
const Org = require("../models/orgModel");

exports.decodeVin = async (req, res, next) => {
  const { vin } = req.params;

  try {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
    );

    const { Results } = response.data;
    const manufacturer = Results.find(
      (item) => item.Variable === "Manufacturer Name",
    ).Value;
    const model = Results.find((item) => item.Variable === "Model").Value;
    const year = Results.find((item) => item.Variable === "Model Year").Value;

    res.status(200).json({
      message: "success",
      data: {
        vehicle: {
          manufacturer,
          model,
          year,
        },
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const org = await Org.findById(req.body.org);

    if (!org) {
      return res.status(404).json({
        status: "fail",
        message: "Organization not found",
      });
    }

    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        vehicle: newVehicle,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate("org");
    res.status(200).json({
      status: "success",
      data: {
        vehicles,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vin).populate("org");
    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
