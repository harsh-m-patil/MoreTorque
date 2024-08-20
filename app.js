const express = require("express");

const vehicleRouter = require("./routes/vehicleRouter");
const orgRouter = require("./routes/orgRouter");

const app = express();

app.use(express.json());

app.use("/vehicle", vehicleRouter);
app.use("/org", orgRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

module.exports = app;
