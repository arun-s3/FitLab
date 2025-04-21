const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    default: 0
  },
  accountNumber: {
    type: String, 
    required: true
  },
  transactions: [
    {
      type: {
        type: String, 
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      transactionId: {
        type: String,
        required: true
      },
      transactionAccountDetails: {
        type: {
          type: String,
          enum: ['fitlab', 'gateway', 'user'], 
          required: true
        },
        account: {
          type: String, 
          required: true
        }
      },      
      notes: {
        type: String, 
      },
      status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
