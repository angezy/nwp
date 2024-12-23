const express = require('express');
const sql = require('mssql');
const validator = require('validator');
const contactValid = require('../middleware/contactvalid');
require('dotenv').config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const router = express.Router();

// Initialize MailerSend
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

router.post('/contact', contactValid, async (req, res) => {
    const dbConfig = req.app.get('dbConfig');
    const referrer = req.get('referer');
    const formData = req.body;

    try {
        const sanitizedFormData = {
            FullName: validator.escape(formData.FullName || ''),
            Email: validator.normalizeEmail(formData.Email || ''),
            content: validator.escape(formData.content || ''),
            lang: validator.escape(formData.lang || 'en'),
        };

        // Save to database
        let pool;
        try {
            pool = await sql.connect(dbConfig);
            const query = `INSERT INTO dbo.userMsg_tbl (FullName, Email, content, lang)
                           VALUES (@FullName, @Email, @content, @lang)`;

            await pool.request()
                .input('FullName', sql.NVarChar, sanitizedFormData.FullName)
                .input('Email', sql.NVarChar, sanitizedFormData.Email)
                .input('content', sql.NVarChar, sanitizedFormData.content)
                .input('lang', sql.NVarChar, sanitizedFormData.lang)
                .query(query);
        } catch (err) {
            throw new Error('Failed to save message to database');
        } finally {
            if (pool) pool.close();
        }

        // Prepare email details
        const lang = sanitizedFormData.lang;
        const subject = lang === 'fa'
            ? 'پیام جدید از طریق فرم تماس'
            : 'New Contact Message Submission';
        const htmlMessage = lang === 'fa'
            ? `<strong>شما یک پیام جدید از ${sanitizedFormData.FullName} (${sanitizedFormData.Email}) دریافت کرده‌اید:</strong><br><br>${sanitizedFormData.content}`
            : `<strong>You have received a new message from ${sanitizedFormData.FullName} (${sanitizedFormData.Email}):</strong><br><br>${sanitizedFormData.content}`;
        const textMessage = lang === 'fa'
            ? `شما یک پیام جدید از ${sanitizedFormData.FullName} (${sanitizedFormData.Email}) دریافت کرده‌اید:\n\n${sanitizedFormData.content}`
            : `You have received a new message from ${sanitizedFormData.FullName} (${sanitizedFormData.Email}):\n\n${sanitizedFormData.content}`;

        // Send email with dynamic recipient
        const sentFrom = new Sender("info@nickswebprojects.site", "Your Website");

        const recipients = [new Recipient(process.env.RECIPIENT_EMAIL2, "Notification")];

        const cc = [new Recipient(process.env.RECIPIENT_EMAIL1, "Notification")];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setCc(cc)
            .setSubject(subject)
            .setHtml(htmlMessage)
            .setText(textMessage);

        // Send the email
        await mailerSend.email.send(emailParams);
        console.log('Email sent successfully');

        const successMessage = encodeURIComponent("Comment submitted successfully!");
        return res.redirect(`${referrer}?success=true&message=${successMessage}`);
    } catch (err) {
        console.error('Error handling contact submission:', err);
        const errorMessage = encodeURIComponent("Error sending comment");
        return res.redirect(`${referrer}?errors=${errorMessage}`);
    }
});

module.exports = router;
