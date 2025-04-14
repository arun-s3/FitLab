const crypto = require('crypto')

const Payment = require('../Models/paymentModel')
const Razorpay = require('../Utils/razorpay')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
// const Offer = require('../Models/offerModel')
// const Coupon = require('../Models/couponModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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
          receipt: `Fitlab_Razorpay_${Date.now()}`,
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

        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, amount} = req.body

        const userId = req.user._id
  
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const expectedSignature = hmac.digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        const order = await Razorpay.orders.fetch(razorpay_order_id)
        const receipt = order?.receipt

        if (isAuthentic){
            const payment = new Payment({
                paymentOrderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                paymentSignature: razorpay_signature,
                paymentMethod: 'razorpay',
                paymentDate: Date.now(),
                userId,
                amount: amount / 100,
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


  const createStripePayment = async(req, res, next)=> {
    try{
        console.log("Inside createStripePayment of paymentController")   

        const { amount } = req.body

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: "inr",
          payment_method_types: ["card"],
          metadata: { integration_check: "accept_a_payment" },
        })

        console.log("paymentIntent--->", JSON.stringify(paymentIntent))
      
        res.status(200).json({ clientSecret: paymentIntent.client_secret })
    }
    catch(error){
        console.log("Error in createStripePayment:", error.message)
        next(error)
    }
  }


  const saveStripePayment = async(req, res, next)=> {
    try{
        const userId = req.user._id
        const { paymentDatas } = req.body
        console.log("paymentDatas-->", JSON.stringify(paymentDatas))

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentDatas.paymentId, { expand: ['latest_charge'] })
        console.log("paymentIntent--->", JSON.stringify(paymentIntent, null, 2))
      
        const receipt = paymentIntent.latest_charge?.receipt_url || ''

        const payment = new Payment({
            ...paymentDatas,
            paymentDate: Date.now(),
            receipt,
            userId,
          });
        
        await payment.save();

        res.status(200).json({ message: 'Payment saved!' })
    }
    catch(error){
        console.log("Error in saveStripePayment:", error.message)
        next(error)
    }
  }

  


module.exports = {getRazorpayKey, createRazorpayPayment, verifyRazorpayPayment, createStripePayment, saveStripePayment}