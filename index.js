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

const app = express();
const port = process.env.PORT;

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

// Routes
app.use('/auth', authRoutes);
app.use('/api', protectedRoute);
app.use('/api', dataRoutes);
app.use('/api', formRoutes);
app.use('/api', blogsRoutes);
app.use('/api', contactRoute);
app.use('/', homeRoute);
app.use('/dashboard', dashRoute);

// login route
app.get('/signin', (req, res) => {
    if (req.user) {
        return res.render('/dashboard');
    }
    res.render('signin', { title: `Sign In`, layout: false })
});
app.get('/signup', (req, res) => res.render('signup', { title: `Sign Up`, layout: false }));

// Forms route
app.get('/Preview-form', (req, res) => res.render('Preview-form', { title: "Exclusive preview", layout: false }));
app.get('/updated-form', (req, res) => res.render('updated-form', { layout: false }));
app.get('/Preview-form-fa', (req, res) => res.render('Preview-form-fa', { title: `پیش نمایش اختصاصی`, layout: false }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);
  res.status(500).send('Internal Server Error');
});

// Start the Application
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});
