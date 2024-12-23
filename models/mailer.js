require('dotenv').config(); // Load .env variables
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY,
});

// Function to send an email
const sendEmail = async (recipientEmail, recipientName, subject, htmlContent, textContent) => {
    const sentFrom = new Sender("info@nickswebprojects.site", "Your Website");

    // Dynamic recipient from form data
    const recipients = [new Recipient(recipientEmail, recipientName)];

    // Hardcoded CC and BCC for notifications
    const cc = [new Recipient(process.env.RECIPIENT_EMAIL2, "Manager")];
    const bcc = process.env.BCC_EMAILS;
    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setCc(cc)
        .setBcc(bcc)
        .setSubject(subject)
        .setHtml(htmlContent)
        .setText(textContent);

    try {
        const response = await mailerSend.email.send(emailParams);
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
