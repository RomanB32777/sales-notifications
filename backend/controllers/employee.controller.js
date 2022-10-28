const db = require("../db");

class EmployeeController {
  async createEmployee(req, res) {
    try {
      const { employee_name, employee_photo } = req.body;

      const newEmployee = await db.query(
        `INSERT INTO employees (employee_name, employee_photo) values ($1, $2) RETURNING *;`,
        [employee_name, employee_photo]
      );

      res.status(200).json(newEmployee.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const deletedEmployee = await db.query(
        `DELETE FROM employees WHERE id = $1 RETURNING *;`,
        [id]
      );
      res.status(200).json(deletedEmployee.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getEmployees(req, res) {
    try {
      const employeesQuery = await db.query(
        "SELECT * FROM employees ORDER BY created_at DESC"
      );

      res.status(200).json(employeesQuery.rows); // employees
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getEmployee(req, res) {
    try {
      const { id } = req.params;
      const city = await db.query("SELECT * FROM employees WHERE id = $1", [
        id,
      ]);
      res.status(200).json(city.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editEmployee(req, res) {
    try {
      const { id, employee_name, employee_photo } = req.body;

      const editedEmployee = await db.query(
        `UPDATE employees SET employee_name = $1, employee_photo = $2 where id = $2 RETURNING *`,
        [employee_name, employee_photo, id]
      );

      res.status(200).json(editedEmployee.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new EmployeeController();
