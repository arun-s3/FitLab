const mongoose = require('mongoose')

const testimonySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true })

module.exports = mongoose.model('Testimony', testimonySchema)
