const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db'); // For connecting to SQL Server
const { validateSignup, handleValidationErrors } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');
const sql = require('mssql');
require('dotenv').config();


// Rate limiter for authentication routes
//const limiter = rateLimit({
  //  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  //  max: 3, // Limit each IP to 3 requests per windowMs (24 hours)
   // message: 'Too many requests from this IP, please try again after 24 hours.'
// });

// router.use(limiter);

// Signup Route
router.post('/signup', validateSignup, handleValidationErrors, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const pool = await dbConfig();

        // Check if the user already exists
        const existingUser = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM dbo.Users_tbl WHERE email = @email');
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 16);

        // Insert the new user into the database
        await pool
            .request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .query(`
                INSERT INTO dbo.Users_tbl (username, email, password, createdAt)
                VALUES (@username, @email, @password, GETDATE())
            `);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign In Route
router.post('/signin', async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        const pool = await sql.connect(dbConfig); 
        // Check if the user exists
        const userResult = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM dbo.Users_tbl WHERE email = @email');

        const user = userResult.recordset[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token with different expiration times based on 'rememberMe'
        const tokenOptions = rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' };
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, tokenOptions);

       res.cookie('authToken', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV, // Only send over HTTPS in production
        sameSite: 'Strict',
    });

console.log({tokenOptions, token});
        res.json({ message: 'Signin successful', token });
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
