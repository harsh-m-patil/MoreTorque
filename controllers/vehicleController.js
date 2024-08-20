const axios = require("axios");

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
