const express = require('express')
const offerRouter = express.Router()
const upload = require('../Utils/multer')

const {isLogin, optionalAuth, authorizeAdmin} = require('../Middlewares/Authentication')

const {createOffer, getAllOffers, updateOffer, deleteOffer, getBestOffer, toggleOfferStatus, 
    increaseOfferImpression} = require('../Controllers/offerController')


offerRouter.post('/add', isLogin, authorizeAdmin, upload.single('offerBanner'), createOffer) 
offerRouter.post('/list', optionalAuth, getAllOffers) 
offerRouter.post('/update/:offerId', isLogin, authorizeAdmin, upload.single('offerBanner'), updateOffer) // put isLogin later
offerRouter.delete('/delete/:offerId', isLogin, authorizeAdmin, deleteOffer) // put isLogin later
offerRouter.post('/bestOffers', optionalAuth, getBestOffer) 
offerRouter.patch('/toggle-status/:offerId', isLogin, authorizeAdmin, toggleOfferStatus)
offerRouter.patch('/impression/:offerId', optionalAuth, increaseOfferImpression)


module.exports = offerRouter