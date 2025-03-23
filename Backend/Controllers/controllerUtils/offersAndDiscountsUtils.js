const mongoose = require("mongoose")
const Product = require("../../Models/productModel")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Coupon = require("../../Models/couponModel")
const {errorHandler} = require("../../Utils/errorHandler")


const VIP_SPENDING_TRESHHOLD = 100000
const USER_INACTIVE_PERIOD = 6 * 30 * 24 * 60 * 60 * 1000


const findUserGroup = async(userId)=> {
    try{
        let userType = !lastOrder 
          ? 'newUsers' : (Date.now() - new Date(lastOrder.orderDate).getTime() > USER_INACTIVE_PERIOD) ? 'returningUsers' : 'all'

        const totalSpent = await Order.aggregate([
            { $match: { userId, 'paymentDetails.paymentStatus': 'completed' } },
            { $group: { _id: null, totalSpent: { $sum: "$absoluteTotalWithTaxes" } } }
        ])
            
        userType = !totalSpent.length ? userType : totalSpent[0].totalSpent >= VIP_SPENDING_TRESHHOLD ? 'VIP' : userType
      
        return userType
    }
    catch(error){
        console.error("Error in findUserGroup:", error.message)
        errorHandler(500, "Internal Server Error.")
    }
}


const calculateBestOffer = async (userId, productId, quantity)=> {
  try {
      console.log("Inside calculateOffer")
      console.log(`userId--->${userId}, productId--->${productId}, quantity---${quantity}`)

      const cart = await Cart.findOne({ userId }).populate("products.productId")
      if (!cart){
          errorHandler(404, "Cart not found!")
      }
      const product = await Product.findById(productId)
      if (!product){
          errorHandler(404, "Product not found!")
      }

      const lastOrder = await Order.findOne({ userId, 'paymentDetails.paymentStatus': 'completed'}).sort({ orderDate: -1 })

      const userType = findUserGroup(userId)

      const offers = await Offer.find({
        targetUserGroup: { $in: [userType, 'all'] },
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        status: "active"
    });

      let bestDiscount = 0;
      let offerDiscountType = null;
      let bestOffer = null;
      let isBOGO = false;
      let freeItem = null;
    
      const calculateDiscount = (offer)=> {
        if (offer.discountType === "percentage") {
          discount = (product.price * quantity * offer.discountValue) / 100
          if (offer.maxDiscount) {
            discount = Math.min(discount, offer.maxDiscount)
          }
        }
        else if (offer.discountType === "fixed") {
          discount = offer.discountValue
          if (offer.maxDiscount) {
            discount = Math.min(discount, offer.maxDiscount)
          }
        } 
        else if (offer.discountType === "buyOneGetOne") {
          isBOGO = true
        }
      }
      
      offers.forEach(async(offer)=> {
        const categoryIds = await Category.find({ name: {$all: product.category} })
          if (offer.applicableType === 'categories' && categoryIds.some(id=> offer.applicableCategories.includes(id))) {
              calculateDiscount(offer)
          }
          if (offer.applicableType === 'products' && offer.applicableProducts.includes(productId.toString())){
            calculateDiscount(offer)
          }
          if (discount > bestDiscount) {
            bestDiscount = discount
            bestOffer = offer._id
            offerDiscountType = offer.discountType
          }
      })

      const productDiscount = product.discountType === 'fixed' ? Math.min(product.discountValue, product.maxDiscount)
                              : Math.min(product.price * quantity * product.discountValue/100, product.maxDiscount)
      if (productDiscount > bestDiscount) {
        bestDiscount = productDiscount
        bestOffer = 'productDiscount'
      }
      // Check if product is already in the cart
      // let existingItem = cart.products.find(item => item.productId.toString() === productId)

      // if (existingItem) {
      //     existingItem.quantity += quantity
      //     if(isBOGO){
      //       existingItem.quantity += quantity
      //     }
      // } else {
      //     cart.items.push({ product: productId, quantity: quantity + extraQuantity });
      // }

      // // Apply the best discount
      // if (bestOffer && bestOffer.discountType !== "buyOneGetOne") {
      //     cart.totalPrice -= bestDiscount;
      // }

      // await cart.save();

      return { offerDiscountType, bestDiscount, offerApplied: bestOffer, isBOGO }
 
  } catch (error) {
      console.error("Error in calculateBestOffer:", error.message)
      errorHandler(500, "Internal Server Error.")
  }
}


module.exports = {calculateBestOffer}
