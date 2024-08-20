const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vin: {
    type: String,
    required: [true, "VIN is required"],
    unique: [true, "This VIN is already in use"],
    minlength: [17, "VIN must be exactly 17 characters long"],
    maxlength: [17, "VIN must be exactly 17 characters long"],
    match: [
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "VIN can only contain uppercase letters (A-Z) and digits (0-9), excluding I, O, Q",
    ],
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: [true, "Organization is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

module.exports = Vehicle;
