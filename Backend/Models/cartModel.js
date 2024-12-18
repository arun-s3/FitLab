const mongoose=require('mongoose')
const category = require('./categoryModel')

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
            total: {
                type: Number,
                require: true
            }
        }
    ],
    absoluteTotal: {
        type: Number,
        required: true,
    },
    discount:{
        type:Number,
        default:0
    }
})



const cart = mongoose.model('Cart', cartSchema)

module.exports = cart