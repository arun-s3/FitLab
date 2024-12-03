const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type:Date,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    alternateMobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["home", "work", "temporary", "gift"],
        default: "Home",
    }
      
})

const address = mongoose.model('Address', addressSchema)

module.exports = address