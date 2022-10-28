const Router = require("express");
const multer = require("multer");
const router = new Router();

const fileController = require("../controllers/file.controller");
const storage = require("../storage");
const { fileFilter } = require("../utils");

router.post(
  "/",
  multer({ storage, fileFilter }).single("file"),
  fileController.uploadFile
);
router.delete('/', fileController.deleteFiles)
router.delete('/:name', fileController.deleteFile)

module.exports = router;
