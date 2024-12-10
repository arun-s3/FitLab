const express = require('express')
const addressRouter = express.Router()
const {isLogin, isLogout} = require('../Middlewares/Authentication')
const {createNewAddress, editAddress, deleteAddress, getAllAddress, setAsDefaultAddress} = require('../Controllers/addressController')

addressRouter.get('/', getAllAddress)
addressRouter.post('/new/:id', createNewAddress)
addressRouter.post('/edit/:id', editAddress)
addressRouter.delete('/delete/:id', deleteAddress)
addressRouter.put('/setAsDefault/:id', setAsDefaultAddress)


module.exports = addressRouter