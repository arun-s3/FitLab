// models/paymentModel.js
const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String, 
    required: true,
  },
  paymentOrderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String, 
    required: true
  },
  paymentSignature: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
//   status: {
//     type: String,
//     enum: ['created', 'paid', 'failed', 'refunded'],
//     default: 'created',
//   },
  paymentMethod: {
    type: String, // e.g., "razorpay", "wallet"
    required: true,
  },
  receipt: {
    type: String,
    default: ''
  },
  notes: {
    type: Object,
    default: ''
  },
  paymentDate: {
    type: Date,
    default: Date.now(),
  }
})

module.exports = mongoose.model('Payment', paymentSchema)
