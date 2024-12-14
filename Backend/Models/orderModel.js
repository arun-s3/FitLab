// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 min: 1,
//             },
//             price: {
//                 type: Number,
//                 required: true,
//             },
//         },
//     ],
//     shippingAddress: {
//         fullName: { type: String, required: true },
//         phoneNumber: { type: String, required: true },
//         addressLine1: { type: String, required: true },
//         addressLine2: { type: String },
//         city: { type: String, required: true },
//         state: { type: String, required: true },
//         postalCode: { type: String, required: true },
//         country: { type: String, required: true },
//     },
//     paymentDetails: {
//         method: { type: String, required: true, enum: ['COD', 'Card', 'UPI', 'Net Banking'] },
//         transactionId: { type: String },
//         status: { type: String, required: true, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
//     },
//     orderStatus: {
//         type: String,
//         enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
//         default: 'Pending',
//     },
//     totalAmount: {
//         type: Number,
//         required: true,
//     },
//     discount: {
//         type: Number,
//         default: 0, 
//     },
//     shippingCost: {
//         type: Number,
//         default: 0,
//     },
//     notes: {
//         type: String
//     },
//     placedAt: {
//         type: Date,
//         default: Date.now,
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now,
//     },
// }, { timestamps: true });


// orderSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// module.exports = mongoose.model('Order', orderSchema);
