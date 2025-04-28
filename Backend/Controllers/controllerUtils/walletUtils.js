const Wallet = require('../../Models/walletModel')
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

module.exports = {generateUniqueAccountNumber, generateTransactionId}