const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protected');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dataRoutes = require('./routes/data');
const dbConfig = require("./config/db");
const formRoutes = require('./routes/formRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const contactRoute = require('./routes/contactusRoute');
const homeRoute = require('./routes/homeRoute');
const dashRoute = require('./routes/dashRoute');


const { ipMiddleware } = require('./middleware/iranair');
const sql = require('mssql');

const app = express();
const port = process.env.PORT;

app.use(ipMiddleware);
// Middleware to handle cookies
app.use(cookieParser());

// Middleware to parse JSON and URL-encoded requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make the database configuration accessible to routes
app.set('dbConfig', dbConfig);

// Set up Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.use(express.json()); // Ensure you can parse JSON requests

// Iran IP redirect middleware (before all routes)
// app.use(require('./middleware/iranRedirect'));

const ipLogger = require('./middleware/ip');

app.use(ipLogger);

// Routes
app.use('/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api', dataRoutes);
app.use('/api', formRoutes);
app.use('/api', blogsRoutes);
app.use('/api', contactRoute);
app.use('/dashboard', dashRoute);
app.use('/', homeRoute);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
        res.status(500).send(err.message);
});

// Start the Application
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});
