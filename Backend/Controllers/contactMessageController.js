const ContactMessage = require("../Models/contactMessageModel")
const nodemailer = require("nodemailer")

const errorHandler = require("../Utils/errorHandler")


const createContactMessage = async (req, res, next)=> {
  try {
    console.log("Inside createContactMessage of contactController")

    const {name, email, phone, message} = req.body.details

    if (!name || !email || !phone || !message) {
      return next(errorHandler(400, "All required fields must be provided"))
    }

    const contactMessage = await ContactMessage.create({name, email, phone, message})

    console.log("Contact message stored successfully:", contactMessage._id)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fitlab0101@gmail.com",
        pass: process.env.FITLABPASS,
      },
    })

    try {
      await transporter.sendMail({
        from: `"FitLab Support" <fitlab0101@gmail.com>`,
        to: email,
        subject: "We’ve received your message – FitLab",
        text: `Hi ${name}, Thank you for contacting FitLab. We’ve received your message and our team will get back to you shortly.
            – FitLab Team`,
      })
    }catch (emailError) {
      console.error("Confirmation email failed:", emailError.message)
    }

    return res.status(201).json({
      success: true, 
      message: "Your message has been received. A confirmation email has been sent. We will get back to you soon",
      data: contactMessage
    })
  } 
  catch (error) {
    console.error("Error creating contact message:", error.message)
    next(error)
  }
}



module.exports = {createContactMessage}
