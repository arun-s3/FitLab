const express = require("express")
const testimonyRouter = express.Router()

const { createOrUpdateTestimony, getTopTestimonies } = require("../Controllers/testimonyController")

const { isLogin, optionalAuth } = require("../Middlewares/Authentication")

testimonyRouter.post("/add", isLogin, createOrUpdateTestimony)
testimonyRouter.get("/top", optionalAuth, getTopTestimonies)

module.exports = testimonyRouter
