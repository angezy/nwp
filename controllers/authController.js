const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/User');

// Sign up a new user
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await createUser(username, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sign in an existing user
exports.signin = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        // Find the user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token with different expiration times based on 'rememberMe'
        const tokenOptions = rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' };
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, tokenOptions);

        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        res.json({ message: 'Signin 2 successful', token });
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
