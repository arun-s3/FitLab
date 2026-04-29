// services/emailService.js
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "fitlab0101@gmail.com",
        pass: process.env.FITLABPASS,
    },
})

const sendEmail = async ({ from, to, subject, text }) => {
    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
        })
    } catch (error) {
        console.error("Email failed:", error.message)
    }
}

module.exports = { sendEmail }