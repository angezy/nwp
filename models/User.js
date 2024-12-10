const dbConfig = require('../config/db');
const sql = require('mssql');

// Find a user by email
async function findUserByEmail(email) {
    const pool = await dbConfig();
    const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM dbo.Users_tbl WHERE email = @email');
    return result.recordset[0]; // Return the first user found
}

// Create a new user
async function createUser(username, email, hashedPassword) {
    const pool = await dbConfig();
    await pool
        .request()
        .input('username', sql.NVarChar, username)
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, hashedPassword)
        .query(`
            INSERT INTO dbo.Users_tbl (username, email, password, createdAt) 
            VALUES (@username, @email, @password, GETDATE())
        `);
    return { username, email };
}

module.exports = { findUserByEmail, createUser };
