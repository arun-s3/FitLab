const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    defaultAddress: {
        type: Boolean,
        required: true,
        default: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
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
    },
    mobile: {
        type: Number,
        required: true
    },
    alternateMobile: {
        type: Number,
    },
    email: {
        type: String,
        required: true
    },
    deliveryInstructions: {
        type: String,
    },
    type: {
        type: String,
        enum: ["home", "work", "temporary", "gift"],
        default: "home",
    } 
})

const address = mongoose.model('Address', addressSchema)

module.exports = address