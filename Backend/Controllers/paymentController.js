const crypto = require('crypto')

const Payment = require('../Models/paymentModel')
const Razorpay = require('../Utils/razorpay')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
// const Offer = require('../Models/offerModel')
// const Coupon = require('../Models/couponModel')

const {errorHandler} = require('../Utils/errorHandler') 


const getRazorpayKey = async (req, res, next)=> {
    try{
        console.log("Inside getRazorpayKeys of paymentController") 
        res.status(200).json({key: process.env.RAZORPAY_KEY_ID})  
    }
    catch(error){
        console.log("Error in getRazorpayKeys:", error.message)
        next(error)
    }
}


const createRazorpayPayment = async (req, res, next)=> {
    try {
        console.log("Inside createRazorpayPayment of paymentController")   
        const { amount } = req.body

        const options = {
          amount: amount * 100, 
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }

        Razorpay.orders.create(options, (error, order)=> {
            if (error) {
                console.log(error)
                return next(errorHandler(500, "Something Went Wrong!"))
            }
            res.status(200).json({data: order})
            console.log(order)
        })
    }
    catch (error){
        console.log("Error in createRazorpayPayment:", error.message)
        next(error)
    }
  }


  const verifyRazorpayPayment = async(req, res, next)=> {
    try{
        console.log("Inside verifyRazorpayPayment of paymentController")   

        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receipt} = req.body

        const userId = req.user._id
  
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const expectedSignature = hmac.digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        if (isAuthentic){
            const payment = new Payment({
                paymentOrderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                paymentSignature: razorpay_signature,
                paymentMethod: 'razorpay',
                paymentDate: Date.now(),
                userId,
                amount,
                receipt: receipt || ''
            })
            await payment.save()
            res.status(200).json({message: "Payment Success!"})
        }
        else{
            console.log("Payment Failed!")
            return next(errorHandler(400, "Payment Failed!"))
        }
    }
    catch(error){
        console.log("Error in verifyRazorpayPayment:", error.message)
        next(error)
    }
  }


module.exports = {getRazorpayKey, createRazorpayPayment, verifyRazorpayPayment}