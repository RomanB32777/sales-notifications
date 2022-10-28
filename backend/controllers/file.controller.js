const { deleteFileByName, deleteOldFiles } = require("../utils");

class FileController {
  uploadFile(req, res) {
    try {
      if (req.file) {
        return res
          .status(201)
          .json({ success: true, filename: req.file.filename });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || "Something broke!" });
    }
  }

  deleteFile(req, res) {
    try {
      const { name } = req.params;
      name && deleteFileByName(name);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || "Something broke!" });
    }
  }

  deleteFiles(req, res) {
    try {
      deleteOldFiles();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new FileController();
