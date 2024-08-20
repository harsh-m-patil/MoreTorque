const express = require("express");
const rateLimit = require("express-rate-limit");
const vehicleRouter = require("./routes/vehicleRouter");

const app = express();

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 1000,
  message: "Too many Requests from this IP,try again in a minute",
});

app.use("/vehicle", limiter);
app.use("/vehicle", vehicleRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

module.exports = app;
