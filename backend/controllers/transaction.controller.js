const axios = require("axios");
const db = require("../db");
const { currencies, initFilteredTopList } = require("../conts");
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
      const queryParams = req.query;
      if (Object.keys(queryParams).length) {
        const { time_period, currency, top_level, middle_level } = queryParams;
        const currenciesSymbols = currencies.filter((c) => c !== currency);
        let currencyToUSDList = {};

        const select_exchange_rate = await db.query(
          `
          SELECT rates 
          FROM exchange_rates 
          WHERE base = $1 AND date_trunc('day', update_at) = date_trunc('day', current_date)`,
          [currency]
        );

        if (select_exchange_rate.rows.length) {
          currencyToUSDList = JSON.parse(select_exchange_rate.rows[0].rates);
        } else {
          const axiosCurrencyToUSD = await axios.get(
            `https://api.apilayer.com/exchangerates_data/latest?symbols=${currenciesSymbols.join(
              ","
            )}&base=${currency}`,
            {
              headers: {
                apikey:
                  process.env.EXC_API_KEY || "KEY_HERE",
              },
            }
          );

          if (axiosCurrencyToUSD.status === 200) {
            currencyToUSDList = axiosCurrencyToUSD.data.rates;
            await db.query(
              `INSERT INTO exchange_rates (base, rates)
                VALUES ($1, $2)
                ON CONFLICT (base)
                DO UPDATE SET
                rates=$2,
                update_at=now()
              `,
              [currency, JSON.stringify(currencyToUSDList)]
            );
          }
        }
        const transactions = await db.query(`
          SELECT e.id, e.employee_name, e.employee_photo, ROUND(SUM(
            t.transaction_value / CASE t.currency
              ${currenciesSymbols
                .map((c) => `WHEN '${c}' THEN ${currencyToUSDList[c]}`)
                .join(" ")}
            ELSE 1
            END
          ))::integer AS sum_transactions
          FROM transactions t
          LEFT JOIN employees e
          ON t.employee_id = e.id 
          WHERE  ${getTimeCurrentPeriod(
            "t.created_at",
            time_period
          )} GROUP BY e.id, e.employee_name, e.employee_photo
          ORDER BY sum_transactions DESC`);

        const filteredTransactions = transactions.rows.length
          ? transactions.rows.reduce((acc, curr) => {
              if (curr.sum_transactions >= top_level)
                return {
                  ...acc,
                  top_level: [...acc.top_level, curr],
                };
              else if (
                curr.sum_transactions >= middle_level &&
                curr.sum_transactions < top_level
              )
                return {
                  ...acc,
                  middle_level: [...acc.middle_level, curr],
                };
              else
                return {
                  ...acc,
                  low_level: [...acc.low_level, curr],
                };
            }, initFilteredTopList)
          : initFilteredTopList;

        return res.status(200).json(filteredTransactions);
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
