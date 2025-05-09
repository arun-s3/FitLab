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
  beneficiaryAccounts : [
    {
      accountNumber: {
        type: String, 
        required: true
      },
      name:  {
        type: String, 
        required: true
      }
    }
  ],
  creditorAccounts : [
    {
      accountNumber: {
        type: String, 
        required: true
      },
      name:  {
        type: String, 
        required: true
      }
    }
  ],
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
      },
      autoRecharge: {
        isEnabled: {
          type: Boolean,
          default: false 
        },
        thresholdAmount: {
          type: Number 
        },   
        rechargeAmount: {
          type: Number 
        },    
        paymentMethod: {                      
          type: {
            type: String,
            enum: ['paypal', 'razorpay', 'stripe'],
            default: 'razorpay'
          },
          account: { type: String },   
        }
      }
      
    }
  ]
})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
