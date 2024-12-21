const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 



const createOrder = async (req, res, next) => {
    try {
      console.log("Inside createOrder of orderController")
      const userId = req.user._id
     
      console.log("orderDetails---->", JSON.stringify(req.body))
      const {paymentDetails, shippingAddressId} = req.body.orderDetails
      let orderStatus = 'processing'
      if(paymentDetails.paymentMethod === 'cashOnDelivery'){
        orderStatus = 'confirmed'
      }
  
      const cart = await Cart.findOne({userId})
      if (!cart || cart.products.length === 0){
        return next(errorHandler(400, "Your cart is empty!"))
      }
  
      console.log("Cart found for checkout:", cart)
  
      let orderTotal = 0
      for (const item of cart.products) {
        const product = await Product.findById(item.productId)
  
        if (!product){
          return next(errorHandler(404, `Product ${item.title} not found!`));
        }
  
        if (product.blocked){
          return next(errorHandler(403, `Product ${item.title} is blocked and cannot be purchased.
             Please remove this product from the cart or search for any alternative product and place Order`))
        }
  
        if (item.quantity > product.stock){
          return next(errorHandler(400, `Insufficient stock for ${item.title}. Only ${product.stock} items available.
             Please lessen the quantity and place Order`));
        }
  
        orderTotal += item.quantity * item.price
      }
      console.log("Order total:", orderTotal)
      
      for (const item of cart.products){
        const product = await Product.findById(item.productId)
        product.stock -= item.quantity
        await product.save()
      }
  
      const order = new Order({
        userId,
        products: cart.products,
        orderTotal,
        gst: cart.gst,
        deliveryCharge: cart.deliveryCharge,
        absoluteTotalWithTaxes: cart.absoluteTotalWithTaxes,
        paymentDetails,
        shippingAddress: shippingAddressId,
        orderStatus,
        orderDate: new Date(),
      })
  
      await order.save()
      console.log("Order created successfully:", order)
  
      cart.products = []
      cart.absoluteTotal = 0
      await cart.save()
  
      res.status(200).json({message: "Checkout successful! Your order has been placed.", order})
    }catch(error){
      console.log("Error in orderController-checkout:", error.message)
      next(error)
    }
  }
  

  module.exports = {createOrder }