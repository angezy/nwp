const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/db'); // Adjust path as needed

router.get('/data', async (req, res) => {
    console.log('GET /api/data called');
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM dbo.WebsiteProjectForm_tbl');
        res.json(result.recordset); // Send fetched data as JSON
    } catch (err) {
        console.error('Error fetching table data:', err);
        res.status(500).json({ error: 'Error fetching table data' });
    }
});

module.exports = router;


