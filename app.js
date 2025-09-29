const express = require("express");
const app = express();
const postRouter = require("./src/router/post.router");
const authRoute = require("./src/router/auth.router");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/post", postRouter);
app.use("/api/user", authRoute);

module.exports = app;
