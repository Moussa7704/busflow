const nodemailer = require('nodemailer');
const { emailTemplate, resetTemplate, bookingConfirmationTemplate } = require('../templates/templates');
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

const sendBookingConfirmationEmail = async (email, {
    passengerName,
    compagnyName,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    tickets
}) => {

    const ticketsWithCid = tickets.map((ticket, index) => ({
        ...ticket,
        cid: `ticket-qr-${index}@busflow`
    }));

    const attachments = ticketsWithCid.map(ticket => ({
        filename: `${ticket.ticket_number}.png`,
        content: Buffer.from(ticket.qr_code.split(",")[1], "base64"),
        cid: ticket.cid
    }));

    await transporter.sendMail({
        from: `"${compagnyName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Confirmation de votre réservation",
        html: bookingConfirmationTemplate({
            passengerName,
            compagnyName,
            departureCity,
            arrivalCity,
            departureTime,
            arrivalTime,
            tickets: ticketsWithCid
        }),
        attachments
    });

};

module.exports = {
    sendOtpEmail,
    sendResetEmail,
    sendBookingConfirmationEmail
}