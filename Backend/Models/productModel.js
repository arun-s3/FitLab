const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
     name: {
       type: String,
       required: true,
       trim: true
     },
     description: {
       type: String,
       required: true
     },
     weights: {
        type: Number,
        required: true
     },
     price: {
       type: Number,
       required: true,
       maxLength: 8
     },
     discountPercentage: {
        type: Number,
        required: false,
        min: [1, "Must be more than 1%"],
        max: [90, "Must be less than 90%"]
     },
     brand: {
        type: String,
        required: true
     },
     ratings: {
       type: Number,
       default: 0,
     },
     images:{
        type: [String],
        required: true,
     },
     thumbnail:{
        type: String,
        required: true
     },
     category: {
       type: String,
       required: true
     },
     stock: {
       type: Number,
       required: true,
       maxLength: 4,
       default: 1,
     },
     totalReviews: {
       type: Number,
       default: 0,
     },
     user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
     reviews: [
       {
         user: {
           type: mongoose.Schema.ObjectId,
           ref: "User",
           required: true,
         },
         name: {
           type: String,
           required: true,
         },
         rating: {
           type: Number,
           required: true,
         },
         comment: {
           type: String,
           required: true,
         },
       },
     ],
    }, {timeStamps:true});

    const productModel = mongoose.model(Product, productSchema)
    
    module.exports = productModel