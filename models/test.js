require("dotenv").config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY, // Set your MailerSend API key in an .env file
});

const sentFrom = new Sender("info@nickswebprojects.site", "Nick Web Admin");

const recipients = [
  new Recipient("hesanick@gmail.com", "Your Client")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("This is a Subject")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");

(async () => {
  try {
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
})();
