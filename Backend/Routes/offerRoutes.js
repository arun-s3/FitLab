const express = require('express')
const offerRouter = express.Router()
const upload = require('../Utils/multer')
const {createOffer, getAllOffers} = require('../Controllers/offerController')
// const {createOffer, getAllOffers, updateOffer, deleteOffer, searchOffers,
//     getBestOffer, compareOffers} = require('../Controllers/offerController')

const {isLogin, isLogout} = require('../Middlewares/Authentication')



offerRouter.post('/add', upload.single('offerBanner'), createOffer)
offerRouter.post('/list', getAllOffers)





module.exports = offerRouter