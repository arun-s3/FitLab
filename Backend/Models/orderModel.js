const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fitlabOrderId: {
        type: String,
        required: true, 
        unique: true
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
            offerApplied: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Offer',
            },
            offerDiscountType: {
                type: String,
                enum: ["percentage", "fixed", "freeShipping", "buyOneGetOne"],
            },
            offerDiscount: {
                type: Number,
                default: 0
            },
            extraQuantity: {
                type: Number,
                default: 0
            },
            offerOrProductDiscount: {
                type: String,
                enum: ["offer", "discount"]
            },
            total: {
                type: Number,
                required: true,
                min: 0
            },
            productStatus: {
                type: String,   
                enum: ['processing', 'confirmed', 'shipped', 'cancelled', 'delivered', 'returning', 'refunded'],
                default: 'processing'
            },
            productCancelReason: {
                type: String,
                default: null,
                maxLength: 500
            },
            productReturnReason: {
                type: String,
                default: null,
                maxLength: 500
            },
            productReturnImages: {
                type: [String],
                default: null,
            },
            productReturnStatus: {
                type: String,   
                enum: ['accepted', 'rejected'],
                default: null
            },
            isProductReviewed: {
                type: Boolean,
                default: false
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
            enum: ['cashOnDelivery', 'razorpay', 'stripe', 'paypal', 'wallet'] 
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
    couponUsed: {
        type: mongoose.Schema.ObjectId,
        ref: "Coupon",
        default: null
    },
    couponDiscount:{
        type: Number,
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
    estimtatedDeliveryDate: {
        type: Date,
        default: null
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
    },
    orderReturnReason: {
        type: String,
        default: null,
        maxLength: 500 
    },
    orderReturnImages: {
        type: [String],
        default: null,
    },
    orderReturnStatus: {
        type: String,   
        enum: ['accepted', 'rejected'],
        default: null
    },
}, {timestamps: true})


module.exports = mongoose.model('Order', orderSchema)
