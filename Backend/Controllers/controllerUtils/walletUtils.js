const Wallet = require('../../Models/walletModel')

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


module.exports = {generateUniqueAccountNumber}