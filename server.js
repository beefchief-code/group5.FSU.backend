const express = require("express");
const app = express();
const PORT = 3000;
require("dotenv").config();
//cors
const cors = require("cors");
app.use(cors({ origin: /localhost/ }));
//logging
app.use(require("morgan")("dev"));
app.use(express.json());
//routes
app.use(require("./api/auth").router);
app.use("/departments", require("./api/departments"));
app.use("/professors", require("./api/professors"));
//404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});
//other error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :(");
});
//log port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
