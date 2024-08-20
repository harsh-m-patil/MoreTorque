const express = require("express");
const dotenv = require("dotenv");
const vehicleRouter = require("./routes/vehicleRouter");

dotenv.config();

const app = express();

app.use("/vehicle", vehicleRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
