const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const vehicleRouter = require("./routes/vehicleRouter");
const orgRouter = require("./routes/orgRouter");

const app = express();

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP! Try again in an hour",
  keyGenerator: (req, res) => req.headers["x-client-id"],
});

app.use(limiter);

app.use("/vehicle", vehicleRouter);
app.use("/org", orgRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

app.get("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "404 Not Found",
  });
});

module.exports = app;
