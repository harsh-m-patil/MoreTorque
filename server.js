const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const vehicleRouter = require("./routes/vehicleRouter");

dotenv.config();

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
