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




router.get('/', async (req, res) => {
    try {
        const blogPosts = await fetchBlogPosts();
        const recentPosts = blogPosts.slice(0, 4);
        res.render('index', { title: `Nick's Web Project page`, blogs: recentPosts });
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
        res.render('blogsfa', { layout: '_fa', title: 'آخرین مقالات', blogs: blogPosts });
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

router.get('/Contactus', (req, res) => res.render('Contactus', { title: `Contact Us` }));

router.get('/zodiak', (req, res) => res.render('zodiak', { title: `چارت تولد رایگان` }));


module.exports = router;
