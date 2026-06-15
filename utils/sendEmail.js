const nodemailer = require('nodemailer');
const { emailTemplate, resetTemplate } = require('../templates/templates');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


const sendOtpEmail = async (email, code) => {
    await transporter.sendMail({
        from: `"Auth System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Code de vérification OTP",
        html: emailTemplate(code)
    });
}

const sendResetEmail = async (email, link) => {
    await transporter.sendMail({
        from: `"Auth System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Réinitialisation du mot de passe",
        html: resetTemplate(link)
    });
};

module.exports = {
    sendOtpEmail,
    sendResetEmail
}