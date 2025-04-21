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

        const wallet = await Wallet.findOne({ userId })
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
      const { amount, notes, paymentMethod, paymentId } = req.body
  
      if (!amount || amount <= 0) {
        return next(errorHandler(400, "Invalid amount provided"))
      }
  
      if (!paymentMethod || !["paypal", "stripe", "razorpay"].includes(paymentMethod)) {
        return next(errorHandler(400, "Invalid or missing payment gateway"))
      }
  
      let wallet = await Wallet.findOne({ userId })
  
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
  
      wallet.balance += amount
  
      const payment = await Payment.findOne({paymentId})

      wallet.transactions.unshift({
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
      })
  
      await wallet.save()
  
      console.log("Funds added successfully to wallet:", wallet._id);
  
      res.status(200).json({ message: "Funds added successfully to wallet", wallet })
    }
    catch (error) {
      console.error("Error in addFundsToWallet controller:", error.message)
      next(error)
    }
}


module.exports = {getOrCreateWallet, addFundsToWallet}
