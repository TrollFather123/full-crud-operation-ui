const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env" });
const server = require("./db/db");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5080;

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
  server;
});

app.use(express.json);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
