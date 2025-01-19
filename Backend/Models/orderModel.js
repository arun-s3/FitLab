const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            title: {
                type: String,
                required: true
            },
            subtitle:{
                type: String,
                required: true
            },
            category: {
                type: [String],
                required: true
            },
            thumbnail: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            total: {
                type: Number,
                required: true,
                min: 0
            },
            productStatus: {
                type: String,   
                enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returning', 'refunded'],
                default: 'processing'
            },
            productCancelReason: {
                type: String,
                default: null,
                maxLength: 500
            },
            isDeleted: {
                type: Boolean,
                default: false
            }
        },
    ],
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true, 
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cashOnDelivery', 'razorpay', 'wallet'] 
        },
        transactionId: {
            type: String 
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending' 
        }
    },
    orderStatus: {
        type: String,   
        enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returning', 'refunded'],
        default: 'processing'
    },
    orderTotal: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0, 
        min: 0,
    },
    gst: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    deliveryCharge: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    absoluteTotalWithTaxes: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    }, 
    deliveryDate: {
        type: Date,
        default: null
    }, 
    deliveryNote: {
        type: String,
        default: null,
        maxLength: 500
    },
    orderCancelReason: {
        type: String,
        default: null,
        maxLength: 500 
    }
}, {timestamps: true})


module.exports = mongoose.model('Order', orderSchema)
