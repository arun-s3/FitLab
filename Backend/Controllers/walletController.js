const Wallet = require('../Models/walletModel')
const Payment = require('../Models/paymentModel')
const Razorpay = require('../Utils/razorpay')
const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')

const {v4: uuidv4} = require('uuid')

const {generateUniqueAccountNumber, generateTransactionId} = require('../Controllers/controllerUtils/walletUtils')
const {encryptData} = require('../Controllers/controllerUtils/encryption')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const {paypal, client} = require('../Utils/paypal')

const {errorHandler} = require('../Utils/errorHandler') 



// const getOrCreateWallet = async (req, res, next)=> {
//     try{
//         console.log("Inside getOrCreateWallet of walletController")   
//         const userId = req.user._id

//         const wallet = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
//         console.log("wallet now--->", wallet)

//         if (!wallet) {
//           const uniqueAccountNumber = await generateUniqueAccountNumber()
//           console.log("Creating new wallet....")
//           console.log("uniqueAccountNumber--->", uniqueAccountNumber)
//           const newWallet = new Wallet({
//             userId,
//             accountNumber: uniqueAccountNumber,
//             balance: 0,
//             transactions: []
//           })
//           await newWallet.save();
//           console.log("Wallet created successfully:", newWallet)

//           const {userId: _, ...safeWallet} = newWallet.toObject()
//           const encryptedWallet = encryptData(safeWallet)

//           res.status(200).json({safeWallet: encryptedWallet, message: 'wallet created'});
//         }else{
//             console.log("Already has a wallet....")
//             console.log("wallet--->", JSON.stringify(wallet))
            
//             const encryptedWallet = encryptData(wallet)

//             res.status(200).json({safeWallet: encryptedWallet, message: 'wallet sent'});
//         }
//     }
//     catch(error){
//         console.log("Error in walletController-getOrCreateWallet:", error.message)
//         next(error)
//     }
// }


const getOrCreateWallet = async (req, res, next)=> {
  try {
    console.log("Inside getOrCreateWallet of walletController")

    const userId = req.user._id
    const queryOptions = req.body.queryOptions || {}

    const wallet = await Wallet.findOne({ userId })
    // const wallet = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')

    console.log("wallet now--->", wallet)

    if (!wallet) {
      const uniqueAccountNumber = await generateUniqueAccountNumber()
      console.log("Creating new wallet....")
      console.log("uniqueAccountNumber--->", uniqueAccountNumber)

      const newWallet = new Wallet({
        userId,
        accountNumber: uniqueAccountNumber,
        balance: 0,
        transactions: [],
      })
      await newWallet.save();
      console.log("Wallet created successfully:", newWallet)

      const { userId: _, ...safeWallet } = newWallet.toObject()
      const encryptedWallet = encryptData(safeWallet)

      return res.status(200).json({ safeWallet: encryptedWallet, message: 'wallet created' })
    } else {
      console.log("Already has a wallet....")

      let transactions = wallet.transactions || []
      let transactionsCount

      if (Object.keys(queryOptions).length > 0) {
        const {
          page = 1,
          status,
          userLevel,
          paymentMethod,
          type,
          limit,
          startDate,
          endDate,
          sortBy = 'createdAt',
          sort = -1, 
        } = queryOptions;

        console.log("Applying queryOptions--->", queryOptions)

        if (status && status !== 'all'){
          transactions = transactions.filter(txn=> txn.status === status)
        }

        if (userLevel){
          transactions = transactions.filter(txn=> txn.transactionAccountDetails.type === 'user')
        }

        if (paymentMethod && paymentMethod !== 'all'){
          transactions = transactions.filter(txn=> 
            txn.transactionAccountDetails.type === 'gateway' &&
            txn.transactionAccountDetails.account.toLowerCase() === paymentMethod.toLowerCase()
          )
        }

        if (type && type !== 'all'){
          transactions = transactions.filter(txn => txn.type && txn.type.toLowerCase() === type.toLowerCase());
        }

        transactionsCount = transactions.length

        if (startDate && endDate){
          const start = new Date(startDate)
          const end = new Date(endDate)
          transactions = transactions.filter(txn=> {
            const created = new Date(txn.createdAt)
            return created >= start && created <= end
          })
        }

        transactions.sort((a, b) => {
          if (sortBy === 'amount') {
            return sort === 1 ? a.amount - b.amount : b.amount - a.amount
          } else if (sortBy === 'createdAt') {
            return sort === 1 
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt)
          }
          return 0
        })

        if (limit) {
          const startSlice = (page - 1) * limit
          const endSlice = startSlice + limit
          transactions = transactions.slice(startSlice, endSlice)
        }
      }

      const { userId: _, ...walletWithoutUserId } = wallet.toObject()
      const transactionsWithoutIds = transactions.map(txn=> {
        delete txn.transactionId
        return txn
      })
      const walletWithoutIds = { ...walletWithoutUserId, transactions: transactionsWithoutIds }
      console.log("walletWithFilteredTransactions--->", JSON.stringify(walletWithoutIds))

      const encryptedWallet = encryptData(walletWithoutIds)

      return res.status(200).json({ safeWallet: encryptedWallet, message: 'wallet sent' , transactionsCount })
    }
  }
  catch (error){
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
  
      let wallet = await Wallet.findOne({userId})
      // let wallet = await Wallet.findOne({userId}).select('-userId -transactions.transactionId')

  
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


const addPeerAccount = async (req, res, next) => {
  try {
    console.log("Inside addPeerAccount controller")
    const userId = req.user._id 
    const {accountNumber, name, isBeneficiary} = req.body.accountDetails

    if (!accountNumber || !name) {
      return next(errorHandler(400, "Account number and name are required"))
    }
    console.log(`account number---> ${accountNumber}, name-----> ${name} and isBeneficiary-----> ${isBeneficiary}`)

    const wallet = await Wallet.findOne({userId})
    if (!wallet) {
      return next(errorHandler(404, "Wallet not found for the user"))
    }

    const alreadyExists = isBeneficiary 
        ? wallet.beneficiaryAccounts.some(acc=> acc.accountNumber === accountNumber)
        : wallet.creditorAccounts.some(acc=> acc.accountNumber === accountNumber)

    if (alreadyExists) {
      return next(errorHandler(409, `${isBeneficiary ? 'Beneficiary' : 'Creditor'} already added`))
    }

    const walletExists = await Wallet.findOne({accountNumber})
    if(!walletExists){
      return next(errorHandler(404, "The entered account number doesn't match any existing FitLab user"))
    }

    if(isBeneficiary){
      wallet.beneficiaryAccounts.push({accountNumber, name})
    }else{
      wallet.creditorAccounts.push({accountNumber, name})
    }
    
    await wallet.save();

    const walletWithoutIds = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
    const encryptedWallet = encryptData(walletWithoutIds)

    res.status(200).json({safeWallet: encryptedWallet, message: 'Peer account added successfully'})
  }
  catch(error){
    const peerType = req?.body?.accountDetails?.isBeneficiary ? 'Beneficiary' : 'Creditor'
    console.error(`Error adding ${peerType}:`, error.message)
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
      return next(errorHandler(400, "Invalid recepient account number or amount"))
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
    const {destinationAccountNumber, amount, notes} = req.body.paymentDetails

    console.log(`destinationAccountNumber---> ${destinationAccountNumber}, amount----> ${amount} and notes---> ${notes}`)

    if (!destinationAccountNumber) {
      return next(errorHandler(400, "Invalid destination account number!"))
    }
    if (!amount || amount <= 0) {
      return next(errorHandler(400, "Invalid amount provided"))
    }

    const wallet = await Wallet.findOne({ userId: userId })
    const destinationWallet = await Wallet.findOne({ accountNumber: 'FTL' + destinationAccountNumber })

    if (!destinationWallet) {
      return next(errorHandler(400, "The entered account number doesn't match any existing FitLab user!"))
    }

    console.log("destinationWallet--->", destinationWallet)

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


const confirmMoneyRequest = async (req, res, next)=> {
  try {
    console.log("Inside confirmMoneyRequest controller")

    const userId = req.user._id
    const transaction_id = req.body.transaction_id

    console.log(`Confirming transaction_id ---> ${transaction_id}`)

    if (!transaction_id){
      return next(errorHandler(400, "Transaction ID is required"))
    }

    const userWallet = await Wallet.findOne({ userId })
    if (!userWallet) return next(errorHandler(404, "Your wallet not found"))

    const receivedRequest = userWallet.transactions.find(
      (tx)=> tx._id.toString() === transaction_id && tx.type === 'request_received' && tx.status === 'pending'
    );

    if (!receivedRequest) {
      return next(errorHandler(404, "Pending money request not found"))
    }

    const {amount, transactionAccountDetails, transactionId: userTransactionId} = receivedRequest

    if (userWallet.balance < amount) {
      return next(errorHandler(400, "Insufficient balance to confirm the request"))
    }

    const requesterWallet = await Wallet.findOne({ accountNumber: transactionAccountDetails.account })
    if (!requesterWallet) {
      return next(errorHandler(404, "Requester wallet not found"))
    }

    userWallet.balance -= parseFloat(amount)
    requesterWallet.balance += parseFloat(amount)

    receivedRequest.status = 'success'
    receivedRequest.completedAt = new Date()

    const userWalletTransactionDetails = {
      type: 'debit',
      amount,
      transactionId: uuidv4(),
      transactionAccountDetails: {
        type: 'user',
        account: requesterWallet.accountNumber
      },
      notes: `Confirmed money request to ${requesterWallet.accountNumber}`,
      status: 'success',
      createdAt: new Date()
    }

    userWallet.transactions.unshift(userWalletTransactionDetails);

    const sentRequest = requesterWallet.transactions.find(
      (tx)=> tx.transactionId === userTransactionId && tx.type === 'request_sent' && tx.status === 'pending'
    )

    if (sentRequest){
      sentRequest.status = 'success'
      sentRequest.completedAt = new Date()
    }

    requesterWallet.transactions.unshift({
      type: 'credit',
      amount,
      transactionId: uuidv4(),
      transactionAccountDetails: {
        type: 'user',
        account: userWallet.accountNumber
      },
      notes: `Money received from ${userWallet.accountNumber}`,
      status: 'success',
      createdAt: new Date()
    });

    await userWallet.save()
    await requesterWallet.save()

    delete userWalletTransactionDetails.transactionId
    const { userId: _, ...safeWallet } = userWallet.toObject()
    safeWallet.transactions.unshift(userWalletTransactionDetails)
    const encryptedWallet = encryptData(safeWallet)

    return res.status(200).json({safeWallet: encryptedWallet, message: "Money request confirmed and amount transferred successfully"});
  }
  catch (error){
    console.error("Error in confirmMoneyRequest:", error.message)
    next(error)
  }
}


const declineMoneyRequest = async (req, res, next)=> {
  try {
    console.log("Inside declineMoneyRequest controller")

    const userId = req.user._id
    const transaction_id = req.body.transaction_id

    console.log(`Declining transaction_id ---> ${transaction_id}`)

    if (!transaction_id){
      return next(errorHandler(400, "Transaction ID is required"))
    }

    const userWallet = await Wallet.findOne({ userId })
    if (!userWallet) return next(errorHandler(404, "Your wallet not found"))

    const receivedRequest = userWallet.transactions.find(
      (tx) => tx._id.toString() === transaction_id && tx.type === 'request_received' && tx.status === 'pending'
    )

    if (!receivedRequest) {
      return next(errorHandler(404, "Pending money request not found"))
    }

    const { transactionAccountDetails, transactionId: userTransactionId } = receivedRequest

    const requesterWallet = await Wallet.findOne({ accountNumber: transactionAccountDetails.account })
    if (!requesterWallet) {
      return next(errorHandler(404, "Requester wallet not found"))
    }

    receivedRequest.status = 'failed'
    receivedRequest.completedAt = new Date()

    const sentRequest = requesterWallet.transactions.find(
      (tx) => tx.transactionId === userTransactionId && tx.type === 'request_sent' && tx.status === 'pending'
    )

    if (sentRequest){
      sentRequest.status = 'failed'
      sentRequest.completedAt = new Date()
    }

    await userWallet.save();
    await requesterWallet.save();

    const walletWithoutIds = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
    const encryptedWallet = encryptData(walletWithoutIds)

    return res.status(200).json({ safeWallet: encryptedWallet, message: "Money request declined successfully." });

  } catch (error) {
    console.error("Error in declineMoneyRequest:", error.message)
    next(error)
  }
}


const payOrderWithWallet = async(req, res, next)=> {
  try {
    console.log("Inside payOrderWithWallet controller")

    const userId = req.user._id
    const {amount, notes} = req.body

    const wallet = await Wallet.findOne({ userId })
    if (!wallet) {
      return next(errorHandler(404, "Wallet not found."))
    }

    console.log("amount-->", amount)
    if (wallet.balance < amount) {
      return next(errorHandler(400, "Insufficient wallet balance."))
    }

    console.log("Wallet balance before payment---->", wallet.balance)
    wallet.balance -= amount
    console.log("Wallet balance after payment---->", wallet.balance)

    const transactionId = generateTransactionId()
    console.log("transactionId-->", transactionId)

    const newTransaction = {
      type: 'debit',
      amount,
      transactionId: transactionId,
      transactionAccountDetails: {
        type: 'fitlab',
        account: 'fitlab-order-paid',
      },
      notes,
      status: 'success',
      createdAt: new Date()
    }

    console.log('newTransaction--->', JSON.stringify(newTransaction))
    wallet.transactions.push(newTransaction)

    await wallet.save();

    console.log("Wallet payment successful")

    return res.status(200).json({message: "Payment successful via wallet.", transactionId});
  }
  catch (error){
    console.error("Error in payOrderWithWallet controller:", error.message)
    next(error)
  }
}


const updateAutoRechargeSettings = async(req, res, next)=> {
  try {
    const userId = req.user._id
    const {isEnabled, thresholdAmount, rechargeAmount, paymentMethod} = req.body.settings

    const wallet = await Wallet.findOne({userId})
    if (!wallet){
      return next(errorHandler(404, "Wallet not foun."))
    }

    wallet.autoRecharge = {
      isEnabled,
      thresholdAmount,
      rechargeAmount,
      paymentMethod
    }

    await wallet.save();

    const walletWithoutIds = await Wallet.findOne({ userId }).select('-userId -transactions.transactionId')
    const encryptedWallet = encryptData(walletWithoutIds)

    res.status(200).json({safeWallet: encryptedWallet, message: 'Auto-Recharge settings updated successfully'})
  }
  catch(error){
    console.error('Error updating auto-recharge settings:', error)
    next(error)
  }
}






module.exports = {getOrCreateWallet, addFundsToWallet, getUserNameFromAccountNumber, addPeerAccount, sendMoneyToUser,
   requestMoneyFromUser, confirmMoneyRequest, declineMoneyRequest, payOrderWithWallet, updateAutoRechargeSettings}
