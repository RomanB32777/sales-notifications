const db = require("../db");

class SettingsController {
  async getSettings(req, res) {
    try {
      const settings = await db.query("SELECT * FROM settings WHERE id = 1");
      res.status(200).json(settings.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editSettings(req, res) {
    try {
      const { time_period, currency, duration_congratulation, top_level, middle_level } = req.body;

      const editedSettings = await db.query(
        `UPDATE settings SET time_period = $1, currency = $2, duration_congratulation = $3, top_level = $4, middle_level = $5 where id = 1 RETURNING *`,
        [time_period, currency, duration_congratulation, top_level, middle_level]
      );

      res.status(200).json(editedSettings.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new SettingsController();
