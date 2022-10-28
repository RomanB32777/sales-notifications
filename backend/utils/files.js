const fs = require("fs");
const moment = require("moment");
const { fileTypes, uploadsFolderName } = require("../conts");

const fileFilter = (req, file, cb) =>
  fileTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);

const deleteFileByName = (fileName) =>
  fs.unlinkSync(__dirname + uploadsFolderName + "/" + fileName);

const deleteOldFiles = () => {
  const files = fs.readdirSync(__dirname + uploadsFolderName);
  const now = moment();
  for (const file of files) {
    birthtime = fs.statSync(
      __dirname + uploadsFolderName + "/" + file
    ).birthtime;
    now.diff(birthtime, "days") > 0 && deleteFileByName(file);
  }
};

module.exports = { fileFilter, deleteFileByName, deleteOldFiles };
