// const mongoose = require("mongoose");

// const productSchema = mongoose.Schema({
//      name: {
//        type: String,
//        required: true,
//      },
//      description: {
//        type: String,
//        required: true
//      },
//      weights: {
//         type: Number,
//         required: false
//      },
//      price: {
//        type: Number,
//        maxLength: 8,
//        required: [true, "Must enter the product price"]
//      },
//      discountPercentage: {
//         type: Number,
//         min: [1, "Must be more than 1%"],
//         max: [90, "Must be less than 90%"],
//         required: false
//      },
//      brand: {
//         type: String,
//         required: [true, "Must enter the brand name"]
//      },
//      ratings: {
//        type: Number,
//        default: 0,
//      },
//      images:{
//         type: [String],
//         required: true,
//      },
//      thumbnail:{
//         type: String,
//         required: true
//      },
//      category: {
//        type: String,
//        required: [true, "Must enter the category the product belongs to"]
//      },
//      stock: {
//        type: Number,
//        maxLength: 4,
//        default: 1,
//        required: true
//      },
//      totalReviews: {
//        type: Number,
//        default: 0,
//      },
//      user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//      reviews: [
//        {
//          user: {
//            type: mongoose.Schema.ObjectId,
//            ref: "User",
//            required: true,
//          },
//          name: {
//            type: String,
//            required: true,
//          },
//          rating: {
//            type: Number,
//            required: true,
//          },
//          comment: {
//            type: String,
//            required: true,
//          },
//        },
//      ],
//     }, {timeStamps:true});

//     const productModel = mongoose.model(Product, productSchema)
    
//     module.exports = productModel