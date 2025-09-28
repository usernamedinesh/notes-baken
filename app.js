const express = require("express");

const app = express();

app.use(express.json());

app.get("health", (_, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
