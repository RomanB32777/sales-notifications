const multer = require("multer");
const { uploadsFolderName } = require("./conts");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, __dirname + uploadsFolderName);
  },
  filename(req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    cb(null, fileName);
  },
});

module.exports = storage;
