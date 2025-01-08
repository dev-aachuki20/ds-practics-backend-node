const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying mail transporter:', error);
    } else {
        console.log('Mail transporter ready');
    }
});

module.exports = transporter;
