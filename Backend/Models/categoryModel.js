const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        default: null
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
    },
    image:{
        name: {
          type: String,
          required: true
        },
        size: {
          type: Number,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        public_id:{
          type: String,
          required: true
        }
      },
   isBlocked:{
      type: Boolean,
      default: false
   },
})

const category = mongoose.model('Category', categorySchema)
    
module.exports = category