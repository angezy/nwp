
require('dotenv').config();
const sql = require('mssql');

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Use encryption if required
        trustServerCertificate: true, // Change to false if you use a trusted certificate
    },
};


// تابع بازیابی داده‌ها
async function getTableData() {
  try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool.request().query('SELECT * FROM dbo.WebsiteProjectForm_tbl');
      console.log('Database query successful');
      return result.recordset;
  } catch (err) {
      console.error('Error querying the database:', err);
      throw new Error('Database query failed'); // Ensure errors bubble up
  }
}
  
  module.exports = { getTableData };