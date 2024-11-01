const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
require('dotenv').config();
const connectToDatabase = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protected');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000; // Use the port defined in .env or default to 5000




// Middleware to parse JSON requests
app.use(express.json());

// Set up Handlebars
app.engine('handlebars', engine({ 
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/auth', authRoutes);
app.use('/api', protectedRoute);

// Handle routes
app.get('/', (req, res) => {
  res.render('index', { title: `Nick's Web Project page` });
});
app.get('/fa', (req, res) => {
  res.render('fa' , { title: 'پروژه‌های وب نیک' });
});
// Handle blogs routes (e.g., about page)
app.get('/Blogs', (req, res) => {
  res.render('Blogs', { title: Blogs  });
});
app.get('/blogsfa', (req, res) => {
  res.render('blogsfa', { title:` بلاگ ها `});
});
app.get('/signin', (req, res) => {
  res.render('signin', { title: `signin` ,  layout: false });
});
app.get('/Contactus', (req, res) => {
  res.render('Contactus', { title: `Contact Us` });
});
app.get('/signup', (req, res) => {
  res.render('signup', {title: `signup` , layout: false });
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title:` dashboard `,  layout: false });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to the database and start the server
async function startServer() {
    try {
        await connectToDatabase(); // Call your connection function
        console.log('Connected to MongoDB!'); // Log success message
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error); // Log the error
        process.exit(1); // Exit the process with an error code
    }
}

// Start the application
async function startServer() {
    try {
        await connectToDatabase(); // Connect to the database

    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process if database connection fails
    }
}

startServer();


        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });