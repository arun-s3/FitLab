const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
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
            },
            total: {
                type: Number,
                require: true
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
            enum: ['cod', 'razorpay', 'wallet'] 
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
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    absoluteTotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0, 
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    gst: {
        type: Number,
        default: 0,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    }
}, {timestamps: true})


module.exports = mongoose.model('Order', orderSchema)
