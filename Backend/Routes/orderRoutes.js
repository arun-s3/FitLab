const express = require("express")
const orderRouter = express.Router()
const upload = require("../Utils/multer")

const {
    createOrder,
    applyCoupon,
    getOrders,
    getAllUsersOrders,
    cancelOrderProduct,
    cancelOrder,
    deleteProductFromOrderHistory,
    changeProductStatus,
    changeOrderStatus,
    initiateReturn,
    handleReturnDecision,
    cancelReturnRequest,
    processRefund,
    getOrderCounts,
    getTodaysLatestOrder,
    checkIfUserBoughtProduct,
    generateInvoice,
    getTopProductByOrders
} = require("../Controllers/orderController")

const { isLogin, authorizeAdmin } = require("../Middlewares/Authentication")

orderRouter.post("/", isLogin, getOrders)
orderRouter.post("/all", isLogin, authorizeAdmin, getAllUsersOrders)
orderRouter.post("/add", isLogin, createOrder)
orderRouter.patch("/status/:orderId", isLogin, authorizeAdmin, changeOrderStatus)
orderRouter.patch("/status/:orderId/products/:productId", isLogin, authorizeAdmin, changeProductStatus)
orderRouter.patch("/cancel", isLogin, cancelOrderProduct)
orderRouter.patch("/cancel/:orderId", isLogin, cancelOrder)
orderRouter.post("/delete/:orderId", isLogin, deleteProductFromOrderHistory)
orderRouter.get("/statusCounts", isLogin, authorizeAdmin, getOrderCounts)
orderRouter.get("/latest", isLogin, getTodaysLatestOrder)
orderRouter.get("/purchaseStatus/:productId", isLogin, checkIfUserBoughtProduct)
orderRouter.post("/return", isLogin, upload.fields([{ name: "images", maxCount: 10 }]), initiateReturn)
orderRouter.post("/return/decision", isLogin, handleReturnDecision)
orderRouter.post("/return/cancel", isLogin, cancelReturnRequest)
orderRouter.post("/refund", isLogin, processRefund)
orderRouter.get("/invoice/:orderId", isLogin, generateInvoice)
orderRouter.get("/stats/top", isLogin, getTopProductByOrders)

module.exports = orderRouter
