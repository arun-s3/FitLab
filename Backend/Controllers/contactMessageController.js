const ContactMessage = require("../Models/contactMessageModel")

const { sendEmail } = require("../Services/email.service")
const { sendContactConfirmation } = require("../Services/emailTemplates")

const errorHandler = require("../Utils/errorHandler")


const createContactMessage = async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body.details

        if (!name || !email || !phone || !message) {
            return next(errorHandler(400, "All required fields must be provided"))
        }

        const contactMessage = await ContactMessage.create({ name, email, phone, message })

        await sendContactConfirmation( sendEmail, {name, email} )

        return res.status(201).json({
            success: true,
            message: "Your message has been received. A confirmation email has been sent. We will get back to you soon",
            data: contactMessage,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = {createContactMessage}
