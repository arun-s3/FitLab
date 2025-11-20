const express = require('express')
const fitnessRouter = express.Router()
const {targetBodyParts} = require('../Controllers/fitnessController')


fitnessRouter.get('/bodyparts', targetBodyParts)


module.exports = fitnessRouter

