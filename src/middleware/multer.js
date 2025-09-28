const { storage } = require("../../config/cludinary");
const multer = require("multer");

const upload = multer({ storage });

module.exports = upload;
