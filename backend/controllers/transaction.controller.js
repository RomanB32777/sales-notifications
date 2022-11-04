const axios = require("axios");
const db = require("../db");
const { currencies, initFilteredTopList } = require("../conts");
const { getTimeCurrentPeriod } = require("../utils");

const sortBySum = (a, b) => b.sum_transactions - a.sum_transactions;

class TransactionController {
  async createTransaction(req, res) {
    try {
      const { project_name, transaction_value, currency, employees } =
        req.body;

      const newTransaction = await db.query(
        `INSERT INTO transactions (project_name, transaction_value, currency) values ($1, $2, $3) RETURNING id;`,
        [project_name, transaction_value, currency]
      );

      if (newTransaction.rows[0]) {
        const manyToManyValues = employees
          .map((employee) => `('${employee}', '${newTransaction.rows[0].id}')`)
          .join(", ");

        await db.query(
          `INSERT INTO employees_transactions (employee_id, transaction_id) VALUES ${manyToManyValues} RETURNING *;`
        );

        const fullNewTransaction = await db.query(
          `
          SELECT t.id, t.project_name, t.transaction_value, t.currency, 
          json_agg(e.*) AS employees
          FROM transactions t
          LEFT JOIN employees_transactions et ON et.transaction_id = t.id
          LEFT JOIN employees e ON e.id = et.employee_id
          WHERE t.id = $1
          GROUP BY t.id, t.project_name, t.transaction_value, t.currency
          `,
          [newTransaction.rows[0].id]
        );

        return res.status(200).json(fullNewTransaction.rows[0]);
      }
      return res.status(200).json({});
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
                  process.env.EXC_API_KEY || "",
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

        const transferToSelectedCurrency = `/ CASE t.currency ${currenciesSymbols
          .map((c) => `WHEN '${c}' THEN ${currencyToUSDList[c]}`)
          .join(" ")}
          ELSE 1
          END`;

        const cooperativeEmployees = await db.query(`
          SELECT ce.employees, SUM(ce.sum_transactions)::integer as sum_transactions FROM (
              SELECT jsonb_agg(DISTINCT e.*) as employees, ROUND(SUM(
                  distinct t.transaction_value ${transferToSelectedCurrency}
                )) AS sum_transactions
              FROM employees_transactions et
              LEFT JOIN employees e ON e.id = et.employee_id
              LEFT JOIN transactions t ON t.id = et.transaction_id
              WHERE ${getTimeCurrentPeriod("t.created_at", time_period)}
              GROUP BY et.transaction_id
              HAVING COUNT (et.employee_id) > 1) ce 
          GROUP BY ce.employees;`);

        const singleEmployeesWithShared = await db.query(`
          WITH sharedCooperatives AS (
            SELECT et.employee_id as employee, SUM(ce.sum_transactions)::integer as sum_transactions FROM
            (
              SELECT et.transaction_id AS transaction, 
                  array_agg(et.employee_id) AS employees,
                  (SUM(distinct t.transaction_value ${transferToSelectedCurrency}) / COUNT(et.employee_id))::integer AS sum_transactions
                FROM employees_transactions et
                LEFT JOIN transactions t ON t.id = et.transaction_id
                WHERE ${getTimeCurrentPeriod("t.created_at", time_period)}
                GROUP BY et.transaction_id
                HAVING COUNT (et.employee_id) > 1
            ) ce
            LEFT JOIN employees_transactions et ON ce.transaction = et.transaction_id
            GROUP BY et.employee_id
          )
        SELECT jsonb_agg(DISTINCT e.*) as employees, SUM(DISTINCT sc.sum_transactions)::integer + SUM(t.transaction_value ${transferToSelectedCurrency})::integer AS sum_transactions
        FROM
        (
          SELECT et.transaction_id, t.transaction_value, t.currency
              FROM employees_transactions et
              LEFT JOIN transactions t ON t.id = et.transaction_id
              WHERE ${getTimeCurrentPeriod("t.created_at", time_period)}
              GROUP BY et.transaction_id, t.transaction_value, t.currency
              HAVING COUNT (et.employee_id) = 1
        ) t
        LEFT JOIN employees_transactions et ON t.transaction_id = et.transaction_id
        LEFT JOIN employees e ON et.employee_id = e.id
        LEFT JOIN sharedCooperatives sc ON sc.employee = et.employee_id
        GROUP BY et.employee_id;`);

        const totalObj = [
          ...cooperativeEmployees.rows,
          ...singleEmployeesWithShared.rows,
        ];

        const emptyEmployees = await db.query(`
          SELECT jsonb_agg(e.*) as employees
          FROM employees e
          LEFT JOIN employees_transactions et on e.id = et.employee_id
          WHERE et.employee_id IS NULL;`);

        const filteredTransactions = totalObj.length
          ? totalObj.reduce((acc, curr) => {
              if (curr.sum_transactions >= top_level)
                return {
                  ...acc,
                  top_level: [...acc.top_level, curr].sort(sortBySum),
                };
              else if (
                curr.sum_transactions >= middle_level &&
                curr.sum_transactions < top_level
              )
                return {
                  ...acc,
                  middle_level: [...acc.middle_level, curr].sort(sortBySum),
                };
              else
                return {
                  ...acc,
                  low_level: [...acc.low_level, curr].sort(sortBySum),
                };
            }, initFilteredTopList)
          : initFilteredTopList;

        return res
          .status(200)
          .json({ ...filteredTransactions, zero_level: emptyEmployees.rows });
      }

      const transactions = await db.query(`
        SELECT t.id, t.project_name, t.transaction_value, t.currency, t.created_at, jsonb_agg(e.*) as employees from transactions t
        LEFT JOIN employees_transactions et ON et.transaction_id = t.id
        LEFT JOIN employees e ON e.id = et.employee_id
        GROUP BY t.id, t.project_name, t.transaction_value, t.currency, t.created_at
        ORDER BY t.created_at DESC`);
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
