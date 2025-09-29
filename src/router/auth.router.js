const express = require("express");
const router = express.Router();
const { createToken, verifyUser } = require("../middleware/verifyUser");

router.post("/:token", verifyUser);
router.post("/create", createToken);
module.exports = router;
