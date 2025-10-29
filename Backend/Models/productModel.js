const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true
    },
    description: {
     type: String,
     required: false
    },
    additionalInformation: {
     type: [String],
     required: false
    },
    price: {
      type: Number,
      min: 10,
      required: [true, "Must enter the product price"]
    },
    discountType: {
     type: String,
     enum: ["percentage", "fixed"],
    },
    discountValue: {
     type: Number,
     default: 0,
    },
    maxDiscount: {
     type: Number,
     default: null,
    },
    brand: {
       type: String,
       required: [true, "Must enter the brand name"]
    },
    //  ratings: {
    //    type: Number,
    //    default: 0,
    //  },
    category: {
       type: [String],
       required: [true, "Must enter the category the product belongs to"]
    },
    subCategory: {
       type: String,
       required: [true, "Must enter the sub-category the product belongs to"]
    },
    stock: {
       type: Number,
       default: 0,
       required: true
    },
    tags: {
       type: [String],
       default: []  
    },
    targetMuscles: {
      type: [String],
      default: null
    },
    //  totalReviews: {
    //    type: Number,
    //    default: 0,
    //  },
    images:{
       type: [{
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
         },
         isThumbnail:{
           type: String,
           required:true
         }
       }],
       required: true,
       // validate: {
       //     validator: function(images){
       //         return images.length >= 3
       //     },
       //     message: "Product must have atleast 3 images"}
    },
    thumbnail:{
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
    weight: {
      type: Number, 
      default: null
    },
    motorPower: {
      type: Number, 
      default: null
    },
    size: {
      type: String, 
      default: null,
      trim: true,
    },
    color: {
      type: String, 
      default: null,
      trim: true,
    },
    variantOf: {
     type: mongoose.Schema.ObjectId,
     ref: "Product",
     default: null, 
    },
    variantType: {
      type: String, 
      enum: ["weight", "motorPower", "size", "color"], 
      default: null 
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    user: {
       type: mongoose.Schema.ObjectId,
       ref: "User",
       // required: true,
     },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true
        },
        name: {
          type: String,
          required: true
        },
        email: {
           type: String,
           required: true
        },
        date: {
           type: Date,
           default: Date.now()
        },
        rating: {
          type: Number,
          required: true
        },
        comment: {
          type: String,
          required: true
        },
      },
     ],
    }, {timestamps:true});

const product = mongoose.model('Product', productSchema)
    
module.exports = product