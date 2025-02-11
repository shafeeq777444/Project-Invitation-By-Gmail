const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.GRIDAPI);

async function sendEmail(to, subject, text, html) {
    const msg = {
        to, // Array of emails
        from: process.env.SENDER, // Must be a verified sender in SendGrid
        subject,
        text, // Fallback text
        html, // HTML content
    };

    try {
        await sgMail.send(msg);
        console.log("✅ Email sent successfully to:", to);
    } catch (error) {
        console.error("❌ Error sending email:", error.response ? error.response.body : error);
    }
}

module.exports = sendEmail;
