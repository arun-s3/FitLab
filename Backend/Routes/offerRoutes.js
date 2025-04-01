const express = require('express')
const offerRouter = express.Router()
const upload = require('../Utils/multer')
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {createOffer, getAllOffers, updateOffer, deleteOffer, getBestOffer} = require('../Controllers/offerController')



offerRouter.post('/add', upload.single('offerBanner'), createOffer) // put isLogin later
offerRouter.post('/list', getAllOffers) // put isLogin later
offerRouter.post('/update/:offerId', upload.single('offerBanner'), updateOffer) // put isLogin later
offerRouter.delete('/delete/:offerId', deleteOffer) // put isLogin later
offerRouter.post('/bestOffers', isLogin, getBestOffer)





module.exports = offerRouter