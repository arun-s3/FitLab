const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    discount: {
        type: Number,
        required: false
    },
    badge: {
        type: String,
        required: false
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    relatedCategory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category',
        default: []
    },
    seasonalActivation: {
        startDate:{
            type: Date,
            default: null
        },
        endDate:{
            type: Date,
            default: null
        }
    }
})

const category = mongoose.model('Category', categorySchema)
    
module.exports = category