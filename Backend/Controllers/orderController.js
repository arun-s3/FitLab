const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const {errorHandler} = require('../Utils/errorHandler') 

const ESTIMATED_DELIVERY_DATE = 5

const createOrder = async (req, res, next)=> {
    try {
      console.log("Inside createOrder of orderController")
      const userId = req.user._id
     
      console.log("orderDetails---->", JSON.stringify(req.body))

      const {paymentDetails, shippingAddressId} = req.body.orderDetails
      let orderStatus = 'pending'
      let deliveryDate;
      if(paymentDetails.paymentMethod === 'cashOnDelivery'){
        orderStatus = 'confirmed'
        deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + ESTIMATED_DELIVERY_DATE)
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
        deliveryDate
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
  

const getOrders = async (req, res, next)=> {
  try {
    console.log("Inside getOrders of orderController");
    console.log("req.body.queryDetails----->", JSON.stringify(req.body.queryDetails))

    const userId = req.user._id
    const {page = 1, limit = 10, orderStatus, sort, month, startDate, endDate} = req.body.queryDetails

    if (month && (startDate || endDate)) {
      return next(errorHandler(409, "Invalid query--Cannot specify both 'month' and 'startDate'/'endDate'."))
    }

    const filter = {userId}
    if (orderStatus && orderStatus != 'orders') {
      console.log("Inside if (orderStatus && orderStatus != 'orders'")
      filter.orderStatus = orderStatus
    }
    const skip = (page - 1) * limit
    console.log(`page-->${page}, limit--->${limit}, skip--->${skip}, orderStatus---->${orderStatus} sort--->${sort}`)
    console.log("filter--->", JSON.stringify(filter))

    // const orders = await Order.find({userId})

    if(month){
      let requiredYear, requiredMonth;
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      if (month <= currentMonth + 1) {
        requiredMonth = currentMonth - month + 1
        requiredYear = currentDate.getFullYear()
      }else{
        requiredMonth = 12 - (month - (currentMonth + 1))
        requiredYear = currentDate.getFullYear() - 1
      }
    
      filter.createdAt = {$gte: new Date(requiredYear, requiredMonth, 1)}
    }

    if (startDate || endDate){
      filter.createdAt = {};
      if (startDate){
        if (isNaN(new Date(startDate))){
          throw new Error("Invalid Date format")
        }
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate){
        if (isNaN(new Date(endDate))){
          throw new Error("Invalid endDate format")
        }
        filter.createdAt.$lte = new Date(endDate)
      }
    }

    const orders = await Order.find(filter)
      .populate('shippingAddress') 
      .sort({createdAt: sort}) 
      .skip(skip)
      .limit(parseInt(limit))

    const totalOrders = await Order.countDocuments(filter);
    // const totalOrders = await Order.countDocuments({userId});

    console.log("orders--->", JSON.stringify(orders))
    
    res.status(200).json({message: 'Orders retrieved successfully', orders,  pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    })
  }catch(error){
    console.error("Error in getOrders:", error.message);
    next(error)
  }
}

const cancelOrderProduct = async (req, res, next) => {
  try {
    console.log("Inside cancelOrderProduct of orderController")
    const {orderId, productId} = req.body

    const order = await Order.findById(orderId)
    if(!order){
      return next(errorHandler(404, "Order not found!"))
    }

    const productIndex = order.products.findIndex((item) => item.productId.toString() === productId)
    if (productIndex === -1){
      return next(errorHandler(404, "Product not found in the order!"))
    }
    const canceledProduct = order.products[productIndex]
    const product = await Product.findById(canceledProduct.productId)
    if (!product){
      return next(errorHandler(404, "Product not found!"))
    }
    product.stock += canceledProduct.quantity
    await product.save()

    order.products.splice(productIndex, 1);

    order.orderTotal -= canceledProduct.total
    order.absoluteTotalWithTaxes = order.orderTotal + order.gst + order.deliveryCharge

    if (order.products.length === 0){
      order.orderStatus = "cancelled"
    }

    await order.save()

    if (order.paymentDetails.paymentMethod !== "cashOnDelivery" && order.paymentDetails.paymentStatus === "completed"){
      console.log("Refund initiated for the order:", order._id)
      // WILL WRITE REFUND LOGIC LATER
    }

    res.status(200).json({ message: "Product successfully canceled from the order", order })
  }catch (error){
    console.log("Error in cancelOrderProduct:", error.message)
    next(error)
  }
}


const cancelOrder = async (req, res, next) => {
  try {
    console.log("Inside cancelOrder of orderController")
    const {orderId} = req.params
    console.log(`orderId---> ${orderId}`)

    const order = await Order.findOne({ _id: orderId}).populate("products.productId")
    if (!order){
      return next(errorHandler(404, "Order not found!"))
    }
    if (order.orderStatus === "cancelled"){
      return next(errorHandler(400, "Order has already been cancelled!"))
    }
    if (["delivered", "returning", "refunded"].includes(order.orderStatus)){
      return next(errorHandler(403, "Order cannot be cancelled as it is already delivered or being returned"))
    }

    for (const item of order.products){
      const product = await Product.findById(item.productId)
      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }
    
    order.orderStatus = "cancelled"
    await order.save()
    console.log("Order cancelled successfully:", order)

    if (order.paymentDetails.paymentMethod !== "cashOnDelivery" && order.paymentDetails.paymentStatus === "completed"){
      console.log("Refund initiated for the order:", order._id)
      // WILL WRITE REFUND LOGIC LATER
    }

    res.status(200).json({ message: "Order cancelled successfully!", order})
  }catch (error){
    console.log("Error in cancelOrder controller:", error.message)
    next(error)
  }
}



module.exports = {createOrder, getOrders, cancelOrderProduct, cancelOrder }