const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: process.env.DB_NAME || 'sales_3',
})

module.exports = pool