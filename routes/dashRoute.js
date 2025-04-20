const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("../config/db");
const authMiddleware = require('../middleware/authMiddleware');

// Function to fetch form data
async function fetchFormData(lang) {
    try {
        let pool = await sql.connect(dbConfig);

        // Fetch data based on the provided language
        let query = lang
            ? `SELECT * FROM dbo.WebsiteProjectForm_tbl WHERE lang = '${lang}'`
            : `SELECT * FROM dbo.WebsiteProjectForm_tbl`;

        let result = await pool.request().query(query);

        return result.recordset; // Return the fetched data
    } catch (err) {
        console.error('Error fetching form data:', err);
        throw new Error('Error fetching form data');
    }
}

async function fetchmessages(lang) {
    try {
        let pool = await sql.connect(dbConfig);
        let query = lang
            ? `SELECT * FROM dbo.userMsg_tbl WHERE lang = '${lang}'`
            : `SELECT * FROM dbo.userMsg_tbl`;

        let result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error fetching form data:', err);
        throw new Error('Error fetching form data');
    }
}



router.get('/', authMiddleware, (req, res) => res.render('dashboard', { title: `Dashboard`, layout: "__dashboard" }));

router.get('/profile', authMiddleware, (req, res) => res.render('profile', { title: `Profile`, layout: "__dashboard" }));

router.get('/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await fetchmessages('en');
        res.render("msgs", { title: `Messages`, layout: "__dashboard", messages: messages });
    } catch (err) {
        res.status(500).send('Error fetching form data');
    }
});

router.get('/messagesfa', authMiddleware, async (req, res) => {
    try {
        const messages = await fetchmessages('fa');
        res.render("msgsfa", { title: `Messages`, layout: "__rtl", messages: messages });
    } catch (err) {
        res.status(500).send('Error fetching form data');
    }
});

router.get('/tables', authMiddleware, async (req, res) => {
    try {
        const formData = await fetchFormData('en');
        res.render('dashTable', { title: `Tables`, layout: "__dashboard", formData: formData });
    } catch (err) {
        res.status(500).send('Error fetching form data');
    }
});

router.get('/tablesfa', authMiddleware, async (req, res) => {
    try {
        const formData = await fetchFormData('fa');
        res.render('dashTablefa', { title: `جدول ها`, layout: "__rtl", formData: formData });
    } catch (err) {
        res.status(500).send('Error fetching form data');
    }
});

router.get('/virtual-reality', authMiddleware, (req, res) => res.render('vreality', { title: `Virtual Reality`, layout: false }));

router.get('/billing', authMiddleware, (req, res) => res.render('billing', { title: `Billing`, layout: "__dashboard" }));

router.get('/rtl', authMiddleware, (req, res) => res.render('rtl', { title: `داشبرد ستاره`, layout: "__rtl" }));

router.get('/billingfa', authMiddleware, (req, res) => res.render('billingfa', { title: `صورتحساب`, layout: "__rtl" }));

router.get('/profilefa', authMiddleware, (req, res) => res.render('profilefa', { title: `اطلاعات شخصی`, layout: "__rtl" }));


// dashEditor route
router.get('/blogsEditorfa', authMiddleware, async (req, res) => {
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

router.get('/blogsEditor', authMiddleware, async (req, res) => {
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

    module.exports = router;