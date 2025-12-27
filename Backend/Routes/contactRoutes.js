const express = require('express')
const contactRouter = express.Router()
const {createContactMessage} = require('../Controllers/contactMessageController')


contactRouter.post('/', createContactMessage)


module.exports = contactRouter
