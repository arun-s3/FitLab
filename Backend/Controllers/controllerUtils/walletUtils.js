const Wallet = require('../../Models/walletModel')
const Razorpay = require('../../Utils/razorpay')
const { v4: uuidv4 } = require('uuid')


const generateUniqueAccountNumber = async ()=> {
    let accountNumber
    let exists = true
  
    while (exists) {
      const random12Digits = Math.floor(100000000000 + Math.random() * 900000000000)
      accountNumber = 'FTL' + random12Digits
      exists = await Wallet.findOne({ accountNumber })
    }
  
    return accountNumber
}

const generateTransactionId = () => {
  const randomId = uuidv4()
  const transactionId = `WLTFTL_${randomId.replace(/-/g, '').slice(0, 16)}`
  return transactionId
}


async function startAutoRecharge(wallet) {
  try {
    const amountToRecharge = wallet.autoRecharge.rechargeAmount * 100; // in paise

    if (wallet.autoRecharge.paymentMethod === "razorpay") {
      const options = {
        amount: amountToRecharge, 
        currency: 'INR',
        receipt: `Fitlab_Razorpay_${Date.now()}`,
      }

      Razorpay.orders.create(options, (error, order)=> {
          if (error) {
              console.error(error)
              return next(errorHandler(500, "Something Went Wrong!"))
          }
          return {data: order}
      })

      wallet.balance += wallet.autoRecharge.rechargeAmount;
      await wallet.save();
    }

  } catch (error) {
    console.error(error);
  }
}


module.exports = {generateUniqueAccountNumber, generateTransactionId, startAutoRecharge}