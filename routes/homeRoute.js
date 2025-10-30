const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("../config/db");

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

async function fetchBlogPosts() {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .query('SELECT * FROM dbo.BlogPosts_tbl WHERE En = 1');
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
            .query('SELECT * FROM dbo.BlogPosts_tbl WHERE En = 0');
        return result.recordset; // Return the list of blog posts
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        throw new Error('Error fetching blog posts'); // Throw an error for the calling function to handle
    }
}



const geoip = require("geoip-lite");

router.get('/', async (req, res) => {
    try {
        // گرفتن IP
        const ip = req.headers['cf-connecting-ip'] || 
                   req.headers['x-forwarded-for'] || 
                   req.socket.remoteAddress;

        // تمیز کردن IPv6 mapped IPv4
        let cleanIp = ip;
        if (cleanIp && cleanIp.startsWith("::ffff:")) {
            cleanIp = cleanIp.substring(7);
        }

        // تشخیص کشور
        const geo = geoip.lookup(cleanIp);

        if (geo && geo.country === "IR") {
            return res.redirect('/fa');
        }

        // اگر ایران نبود
        const blogPosts = await fetchBlogPosts();
        const recentPosts = blogPosts.slice(0, 4);
        res.render('index', { title: `Nick Web Project`, blogs: recentPosts });

    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/fa', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPostsfa();
        const recentPosts = blogPosts.slice(0, 4);
        res.render('fa', { title: 'نیک وب پروژه', layout: "_fa", blogs: recentPosts });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/Blogs', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPosts();
        res.render('blogs', { layout: 'main', title: 'All Blog Posts', blogs: blogPosts });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/blog/:id', async (req, res) => {
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

router.get('/blogsfa', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPostsfa();
        res.render('blogsFa', { layout: '_fa', title: 'آخرین مقالات', blogs: blogPosts });
    } catch (err) {
        res.status(500).send('Error fetching blog posts');
    }
});

router.get('/blogfa/:id', async (req, res) => {
    const postId = req.params.id;
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



// login route
router.get('/signin', (req, res) => {
    if (req.user) {
        return res.render('/dashboard');
    }
    res.render('signin', { title: `Sign In`, layout: false })
});
router.get('/signup', (req, res) => res.render('signup', { title: `Sign Up`, layout: false }));

// Forms route
router.get('/Preview-form', (req, res) => res.render('Preview-form', { title: "Exclusive preview", layout: false }));
router.get('/updated-form', (req, res) => res.render('updated-form', { layout: false }));
router.get('/Preview-form-fa', (req, res) => res.render('Preview-form-fa', { title: `پیش نمایش اختصاصی`, layout: false }));




router.get('*', (req, res) => {
    res.status(404).render('404', { title: "Page Not Found", layout: false });
});






router.get('/contactus', (req, res) => res.render('Contactus', { title: `Contact Us` }));

router.get('/zodiak', (req, res) => res.render('zodiak', { title: `چارت تولد رایگان` }));


module.exports = router;
