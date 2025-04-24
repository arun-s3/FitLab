const Wallet = require('../Models/walletModel')
const Payment = require('../Models/paymentModel')
const Razorpay = require('../Utils/razorpay')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')

const {v4: uuidv4} = require('uuid')

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

            // delete transactionDetails.transactionId
            // const {userId: _, ...safeWallet} = wallet.toObject()
            // safeWallet.transactions.unshift(transactionDetails)
            
            // allTransactions =  safeWallet.transactions.map(transaction=> {
            //   delete transaction.transactionId
            // })
            
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


const getUserNameFromAccountNumber = async (req, res, next) => {
  try {
    const {acc} = req.params

    if (!acc) {
      return next(errorHandler(404, "Account number is required"))
    }

    const wallet = await Wallet.findOne({ accountNumber: acc }).populate('userId', 'username')

    if (!wallet || !wallet.userId) {
      return next(errorHandler(404, "User not found with this account number"))
    }

    res.status(200).json({
      username: wallet.userId.username,
      message: 'User found successfully'
    })
  }
  catch (error) {
    console.error('Error finding user from account number:', error.message)
    next(error)
  }
}


const addBeneficiaryAccount = async (req, res, next) => {
  try {
    console.log("Inside addBeneficiaryAccount controller")
    const userId = req.user._id 
    const {accountNumber, name} = req.body.accountDetails

    if (!accountNumber || !name) {
      return next(errorHandler(400, "Account number and name are required"))
    }
    console.log(`account number---> ${accountNumber} and name-----> ${name}`)

    const wallet = await Wallet.findOne({userId})
    if (!wallet) {
      return next(errorHandler(404, "Wallet not found for the user"))
    }

    const alreadyExists = wallet.beneficiaryAccounts.some(
      (acc)=> acc.accountNumber === accountNumber
    )
    if (alreadyExists) {
      return next(errorHandler(409, "Beneficiary already added"))
    }

    const walletExists = await Wallet.findOne({accountNumber})
    if(!walletExists){
      return next(errorHandler(404, "The entered account number doesn't match any existing FitLab user"))
    }

    wallet.beneficiaryAccounts.push({accountNumber, name})
    await wallet.save();

    const walletWithoutIds = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
    const encryptedWallet = encryptData(walletWithoutIds)

    res.status(200).json({safeWallet: encryptedWallet, message: 'Beneficiary added successfully'})
  }
  catch(error){
    console.error('Error adding beneficiary:', error.message)
    next(error)
  }
}


const sendMoneyToUser = async (req, res, next)=> {
  try {
    console.log("Inside sendMoneyToUser controller")
    const userId = req.user._id
    const {recipientAccountNumber, amount, notes} = req.body.paymentDetails

    console.log(`recipientAccountNumber---> ${recipientAccountNumber}, amount----> ${amount} and notes---> ${notes}`)

    if (!recipientAccountNumber || !amount || amount <= 0){
      return next(errorHandler(400, "Invalid recipient accountNumber"))
    }
    if (!amount || amount <= 0) {
      return next(errorHandler(400, "Invalid amount provided"))
    }

    const wallet = await Wallet.findOne({ userId })
    if (!wallet) return next(errorHandler(404, "Your wallet not found"))

    if (wallet.accountNumber === recipientAccountNumber) {
      return next(errorHandler(400, "Cannot transfer to your own account"))
    }
    if (wallet.balance < amount) {
      return next(errorHandler(400, "Insufficient balance"))
    }

    const recipientWallet = await Wallet.findOne({accountNumber: recipientAccountNumber})
    if (!recipientWallet) return next(errorHandler(404, "Recipient wallet not found"))

    const transactionId = uuidv4()

    wallet.balance -= parseFloat(amount)
    const walletTransactionDetails = {
      type: 'debit',
      amount,
      transactionId,
      transactionAccountDetails: {
        type: 'user',
        account: recipientWallet.accountNumber
      },
      notes,
      status: 'success',
      createdAt: new Date()
    }
    wallet.transactions.unshift(walletTransactionDetails)

    recipientWallet.balance += parseFloat(amount)
    recipientWallet.transactions.unshift({
      type: 'credit',
      amount,
      transactionId,
      transactionAccountDetails: {
        type: 'user',
        account: wallet.accountNumber
      },
      notes,
      status: 'success',
      createdAt: new Date()
    })

    await wallet.save()
    await recipientWallet.save()

    delete walletTransactionDetails.transactionId
    const {userId: _, ...safeWallet} = wallet.toObject()
    safeWallet.transactions.unshift(walletTransactionDetails)
    const encryptedWallet = encryptData(safeWallet)

    res.status(200).json({ safeWallet: encryptedWallet, message: "Money sent successfully" })
  }
  catch (error){
    console.error("Error in sendMoneyToUser:", error.message)
    next(error)
  }
}


const requestMoneyFromUser = async (req, res, next)=> {
  try {
    console.log("Inside requestMoneyFromUser controller")
    const userId = req.user._id
    const {destinationAccountNumber, amount, notes} = req.body

    if (!destinationAccountNumber) {
      return res.status(400).json({ message: "Invalid destination accountNumber!" })
    }
    if (!amount || amount <= 0) {
      return next(errorHandler(400, "Invalid amount provided"))
    }

    const wallet = await Wallet.findOne({ userId: userId })
    const destinationWallet = await Wallet.findOne({ accountNumber: destinationAccountNumber })

    if (!wallet) return next(errorHandler(404, "Your wallet not found"))

    if (wallet.accountNumber === destinationAccountNumber) {
      return next(errorHandler(400, "Cannot request to your own account"))
    }

    const transactionId = uuidv4()

    destinationWallet.transactions.push({
      type: 'request_received',
      amount,
      transactionId,
      transactionAccountDetails: {
        type: 'user',
        account: wallet.accountNumber,
      },
      notes: notes || `Money request from ${wallet.accountNumber}`,
      status: 'pending'
    })

    const transactionDetails = {
      type: 'request_sent',
      amount,
      transactionId,
      transactionAccountDetails: {
        type: 'user',
        account: destinationWallet.accountNumber,
      },
      notes: notes || `Money requested from ${destinationWallet.accountNumber}`,
      status: 'pending'
    }
    wallet.transactions.push(transactionDetails)

    await destinationWallet.save()
    await wallet.save()

    delete transactionDetails.transactionId
    const {userId: _, ...safeWallet} = wallet.toObject()
    safeWallet.transactions.unshift(transactionDetails)
    const encryptedWallet = encryptData(safeWallet)

    return res.status(200).json({ safeWallet: encryptedWallet, message: 'Money request sent successfully.' })
  }
  catch (error){
    console.error('Error in requestMoney:', error)
    next(error)
  }
}




module.exports = {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addBeneficiaryAccount,
   sendMoneyToUser, requestMoneyFromUser}
