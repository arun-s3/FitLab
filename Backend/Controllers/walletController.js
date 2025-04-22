const Wallet = require('../Models/walletModel')
const Payment = require('../Models/paymentModel')
const Razorpay = require('../Utils/razorpay')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')

const {generateUniqueAccountNumber} = require('../Controllers/controllerUtils/walletUtils')
const {encryptData} = require('../Controllers/controllerUtils/encryption')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {paypal, client} = require('../Utils/paypal')

const {errorHandler} = require('../Utils/errorHandler') 



const getOrCreateWallet = async (req, res, next)=> {
    try{
        console.log("Inside getOrCreateWallet of walletController")   
        const userId = req.user._id

        const wallet = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
        console.log("wallet now--->", wallet)

        if (!wallet) {
          const uniqueAccountNumber = await generateUniqueAccountNumber()
          console.log("Creating new wallet....")
          console.log("uniqueAccountNumber--->", uniqueAccountNumber)
          const newWallet = new Wallet({
            userId,
            accountNumber: uniqueAccountNumber,
            balance: 0,
            transactions: []
          })
          await newWallet.save();
          console.log("Wallet created successfully:", newWallet)

          const {userId: _, ...safeWallet} = newWallet.toObject()
          const encryptedWallet = encryptData(safeWallet)

          res.status(200).json({safeWallet: encryptedWallet, message: 'wallet created'});
        }else{
            console.log("Already has a wallet....")
            console.log("wallet--->", JSON.stringify(wallet))
            
            const encryptedWallet = encryptData(wallet)

            res.status(200).json({safeWallet: encryptedWallet, message: 'wallet sent'});
        }
    }
    catch(error){
        console.log("Error in walletController-getOrCreateWallet:", error.message)
        next(error)
    }
}


const addFundsToWallet = async (req, res, next)=> {
    try {
      console.log("Inside addFundsToWallet controller")
  
      const userId = req.user._id
      const { amount, notes, paymentMethod, paymentId } = req.body.paymentDetails
  
      if (!amount || amount <= 0) {
        return next(errorHandler(400, "Invalid amount provided"))
      }
      if (!["paypal", "stripe", "razorpay"].includes(paymentMethod)) {
        return next(errorHandler(400, "Invalid payment method"))
      }
  
      if (!paymentMethod || !["paypal", "stripe", "razorpay"].includes(paymentMethod)) {
        return next(errorHandler(400, "Invalid or missing payment gateway"))
      }
  
      let wallet = await Wallet.findOne({userId}).select('-userId -transactions.transactionId')
  
      if (!wallet) {
        const uniqueAccountNumber = await generateUniqueAccountNumber()
          console.log("Creating new wallet....")
          console.log("uniqueAccountNumber--->", uniqueAccountNumber)
          wallet = new Wallet({
            userId,
            accountNumber: uniqueAccountNumber,
            balance: 0,
            transactions: []
          })
          console.log("Wallet created successfully:", wallet)
      }
  
      wallet.balance += parseInt(amount)
  
      const payment = await Payment.findOne({paymentId})
      if (!payment) {
        return next(errorHandler(404, "Payment not found"))
      }
      const isAlreadyAdded = wallet.transactions.some(transaction=> transaction.transactionId === paymentId)
      if (isAlreadyAdded){
        return res.status(200).json({ message: "Payment already added to wallet" })
      }      

      const transactionDetails = {
        type: "credit",
        amount,
        transactionId: paymentId,
        transactionAccountDetails: {
          type: "gateway",
          account: paymentMethod
        },
        notes,
        status: "success",
        createdAt: payment.paymentDate
      }
      wallet.transactions.unshift(transactionDetails)
  
      await wallet.save()
  
      console.log("Funds added successfully to wallet:", wallet._id);

      delete transactionDetails.transactionId
      const {userId: _, ...safeWallet} = wallet.toObject()
      safeWallet.transactions.unshift(transactionDetails)

      const encryptedWallet = encryptData(safeWallet)
      res.status(200).json({ safeWallet: encryptedWallet, message: "Funds added successfully to wallet" })
    }
    catch (error) {
      console.error("Error in addFundsToWallet controller:", error.message)
      next(error)
    }
}


module.exports = {getOrCreateWallet, addFundsToWallet}
