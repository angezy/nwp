const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
require('dotenv').config();
const authRoutes = require('./routes/auth'); 
const protectedRoute = require('./routes/protected'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const sql = require('mssql');
const dataRoutes = require('./routes/data');
const dbConfig = require("./config/db");
const formRoutes = require('./routes/formRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const authMiddleware = require('./middleware/authMiddleware'); 

const fetchBlogPost = async (postId) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('PostId', sql.Int, postId) 
            .query('SELECT Title, Imag, Contents FROM dbo.BlogPosts_tbl WHERE postId = @PostId');
        return result.recordset[0]; 
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};


const app = express();
const port = process.env.PORT;

// Middleware to handle cookies
app.use(cookieParser());

// Middleware to parse JSON and URL-encoded requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function fetchBlogPosts() {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT postId, Title, Description, Imag, Contents, En, CreatedAt FROM dbo.BlogPosts_tbl WHERE En = 1');
        return result.recordset;
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        throw new Error('Error fetching blog posts'); 
    }
}
async function fetchBlogPostsfa() {
    try {
        // Connect to the database
        let pool = await sql.connect(dbConfig);
        // Query all blog posts
        let result = await pool.request()
            .query('SELECT postId, Title, Description, Imag, Contents, En, CreatedAt FROM dbo.BlogPosts_tbl WHERE En = 0');
        return result.recordset; // Return the list of blog posts
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        throw new Error('Error fetching blog posts'); // Throw an error for the calling function to handle
    }
}

// Function to fetch form data
async function fetchFormData() {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT * FROM dbo.WebsiteProjectForm_tbl');
        return result.recordset; // Return all form data
    } catch (err) {
        console.error('Error fetching form data:', err);
        throw new Error('Error fetching form data');
    }
}


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

// Render Handlebars Views
app.get('/', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPosts(); 
        const recentPosts = blogPosts.slice(0, 4); 
        res.render('index', { title: `Nick's Web Project page`, blogs: recentPosts })
    } catch (err) {
        res.status(500).send(err.message); 
    }
});
app.get('/fa', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPostsfa();
        const recentPosts = blogPosts.slice(0, 4); 
        res.render('fa', { title: 'پروژه‌های وب نیک', layout: "_fa", blogs: recentPosts })
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/Blogs', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPosts(); 
        res.render('blogs', { layout: 'main', title: 'All Blog Posts', blogs: blogPosts });
    } catch (err) {
        res.status(500).send(err.message); 
    }
});
app.get('/blogsfa', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPostsfa();
        res.render('blogsfa', { layout: '_fa', title: 'آخرین مقالات', blogs: blogPosts });
    } catch (err) {
        res.status(500).send('Error fetching blog posts');
    }
});
app.get('/blogfa/:id', async (req, res) => {
    const postId = req.params.id; // Get the post ID from the URL
    try {
        const post = await fetchBlogPost(postId); 
        if (!post) {
            return res.status(404).send('Blog post not found');
        }
        res.render('blogfa', { layout: '_fa', title: post.Title, postt: post });
    } catch (err) {
        res.status(500).send('Error retrieving blog post');
    }
});
app.get('/blog/:id', async (req, res) => {
    const postId = req.params.id; 
    try {
        const post = await fetchBlogPost(postId); 
        if (!post) {
            return res.status(404).send('Blog post not found');
        }
        res.render('blog', { layout: 'main', title: post.Title, postt: post });
    } catch (err) {
        res.status(500).send('Error retrieving blog post');
    }
});
app.get('/Contactus', (req, res) => res.render('Contactus', { title: `Contact Us` }));

// login route
app.get('/signin', (req, res) => {
    if (req.user) {
        return res.render('/dashboard');
    }
    res.render('signin', { title: `Sign In`, layout: false })
});
app.get('/signup', (req, res) => res.render('signup', { title: `Sign Up`, layout: false }));

// dash route

app.get('/dashboard', authMiddleware,  (req, res) => res.render('dashboard', { title: `Dashboard`, layout: "__dashboard" }));
app.get('/profile', authMiddleware,  (req, res) => res.render('profile', { title: `Profile`, layout: "__dashboard" }));
app.get('/tables', authMiddleware, async (req, res) => {
    try {
        const formData = await fetchFormData();
      //  res.json(formData);  Return the form data as JSON to be used in the frontend
        res.render('dashTable', { title: `Tables`, layout: "__dashboard" , formData: formData});
    } catch (err) {
        res.status(500).send('Error fetching form data');
    } 
});
app.get('/tablesfa', authMiddleware, async (req, res) => {
    try {
        const formData = await fetchFormData();
      //  res.json(formData);  Return the form data as JSON to be used in the frontend
        res.render('dashTablefa', { title: `جدول ها`, layout: "__rtl" , formData: formData});
    } catch (err) {
        res.status(500).send('Error fetching form data');
    } 
});
app.get('/virtual-reality', authMiddleware,  (req, res) => res.render('vreality', { title: `Virtual Reality`, layout: false }));
app.get('/billing', authMiddleware,  (req, res) => res.render('billing', { title: `Billing`, layout: "__dashboard" }));
app.get('/rtl', authMiddleware,  (req, res) => res.render('rtl', { title: `داشبرد ستاره`, layout: "__rtl" }));
app.get('/billingfa', authMiddleware,  (req, res) => res.render('billingfa', { title: `صورتحساب`, layout: "__rtl" }));
app.get('/profilefa', authMiddleware,  (req, res) => res.render('profilefa', { title: `اطلاعات شخصی`, layout: "__rtl" }));

// dashEditor route
app.get('/blogsEditorfa', authMiddleware,  async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT postId, Title, Description, Imag, Contents, En, CreatedAt FROM dbo.BlogPosts_tbl WHERE En = 0');
        const blogPosts = result.recordset; 
        res.render('blogsEditorfa', { layout: '__rtl', title: 'ویرایش مقالات', blogs: blogPosts });
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        res.status(500).send('Error fetching blog posts');
    }
});
app.get('/blogsEditor', authMiddleware, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT postId, Title, Description, Imag, Contents, En, CreatedAt FROM dbo.BlogPosts_tbl WHERE En = 1');
        const blogPosts = result.recordset; 
        res.render('blogsEditor', { layout: '__dashboard', title: ' Blog Editor', blogs: blogPosts });
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        res.status(500).send('Error fetching blog posts');
    }
});

// Forms route
app.get('/Preview-form', (req, res) => res.render('Preview-form', { layout: false }));
app.get('/updated-form', (req, res) => res.render('updated-form', { layout: false }));
app.get('/Preview-form-fa', (req, res) => res.render('Preview-form-fa', { title: `پیش نمایش اختصاصی`, layout: false }));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the Application
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});
