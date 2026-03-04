const express = require("express")
const addressRouter = express.Router()

const { isLogin } = require("../Middlewares/Authentication")

const {
    createNewAddress,
    editAddress,
    deleteAddress,
    getAllAddress,
    getDefaultAddress,
    setAsDefaultAddress,
} = require("../Controllers/addressController")

addressRouter.get("/", isLogin, getAllAddress)
addressRouter.get("/:id/default", isLogin, getDefaultAddress)
addressRouter.post("/new/:id", isLogin, createNewAddress)
addressRouter.post("/edit/:id", isLogin, editAddress)
addressRouter.delete("/delete/:id", isLogin, deleteAddress)
addressRouter.put("/setAsDefault/:id", isLogin, setAsDefaultAddress)

module.exports = addressRouter
