const mongoose=require('mongoose')
const Offer = require('./offerModel')
const Coupon = require('./couponModel')


const cartSchema=new mongoose.Schema({
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
                required: true
            },  
            title: {
                type: String,
                required: true
            },
            subtitle: {
                type: String,
                required: true
            },
            category:{
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
            },
            price: {
                type: Number,
                required: true
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
                required: true
            }
        }
    ],
    absoluteTotal: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type:Number,
        default:0
    },
    gst: {
        type: Number,
        required: true,
        default: 0,
    },
    deliveryCharge: {
        type: Number,
        required: true,
        default: 0,
    },
    couponUsed: {
        type: mongoose.Schema.ObjectId,
        ref: "Coupon",
        default: null
    },
    couponDiscount: {
        type: Number
    },
    absoluteTotalWithTaxes: {
        type: Number,
        required: true,
        default: 0,
    },
})



const cart = mongoose.model('Cart', cartSchema)

module.exports = cart