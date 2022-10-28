const axios = require("axios");
const db = require("../db");
const { getTimeCurrentPeriod } = require("../utils");

class TransactionController {
  async createTransaction(req, res) {
    try {
      const { project_name, transaction_value, currency, employee_id } =
        req.body;

      const newTransaction = await db.query(
        `INSERT INTO transactions (project_name, transaction_value, currency, employee_id) values ($1, $2, $3, $4) RETURNING id;`,
        [project_name, transaction_value, currency, employee_id]
      );

      const fullNewTransaction = await db.query(
        `
          SELECT t.*, e.employee_name, e.employee_photo
          FROM transactions t
          LEFT JOIN employees e
          ON t.employee_id = e.id 
          WHERE t.id = $1`,
        [newTransaction.rows[0].id]
      );

      res.status(200).json(fullNewTransaction.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;
      const deletedTransaction = await db.query(
        `DELETE FROM transactions WHERE id = $1 RETURNING *;`,
        [id]
      );
      res.status(200).json(deletedTransaction.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getTransactions(req, res) {
    try {
      const { time_period, currency } = req.query;
      if (time_period && currency) {
        const axiosCurrencyToUSD = await axios.get(
          "https://cdn.cur.su/api/latest.json"
        );
        const currencyToUSDList = axiosCurrencyToUSD.status === 200 && axiosCurrencyToUSD.data.rates

        const transactions = await db.query(`
          SELECT e.id, e.employee_name, e.employee_photo, SUM(
            t.transaction_value::numeric / CASE t.currency
                WHEN 'EUR' THEN ${currencyToUSDList["EUR"]}
                WHEN 'RUB' THEN ${currencyToUSDList["RUB"]}
                WHEN 'AED' THEN ${currencyToUSDList["AED"]}
            ELSE 1
            END
          ) AS sum_transactions
          FROM transactions t
          LEFT JOIN employees e
          ON t.employee_id = e.id 
          WHERE  ${getTimeCurrentPeriod(
            "t.created_at",
            time_period
          )} GROUP BY e.id, e.employee_name, e.employee_photo
          ORDER BY sum_transactions DESC`);
        return res.status(200).json(transactions.rows);
      }
      const transactions = await db.query(`
        SELECT t.*, e.employee_name, e.employee_photo FROM transactions t
        LEFT JOIN employees e
        ON t.employee_id = e.id
        ORDER BY created_at DESC`);
      return res.status(200).json(transactions.rows);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await db.query(
        "SELECT * FROM transactions WHERE id = $1",
        [id]
      );
      res.status(200).json(transaction.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editTransaction(req, res) {
    try {
      const { id, project_name, transaction_value, employee_id } = req.body;

      const editedTransaction = await db.query(
        `UPDATE transactions SET project_name = $1, transaction_value = $2, employee_id = $3 WHERE id = $4 RETURNING *;`,
        [project_name, transaction_value, employee_id, id]
      );

      res.status(200).json(editedTransaction.rows[0]);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new TransactionController();
