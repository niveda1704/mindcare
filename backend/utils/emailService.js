const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true, // Show debug output
            logger: true // Log information to console
        });

        await transporter.sendMail({
            from: `"MindCare Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: text,
            html: html,
        });

        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('❌ EMAIL AILING FAILED:', error);
        console.log('Ensure EMAIL_USER and EMAIL_PASS in .env are correct google app credentials.');
    }
};

module.exports = sendEmail;
