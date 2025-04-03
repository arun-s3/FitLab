const Order = require('../Models/orderModel')
const Cart = require('../Models/cartModel')
const Product = require('../Models/productModel')
const Offer = require('../Models/offerModel')
const Coupon = require('../Models/couponModel')

const {calculateCharges} = require('./controllerUtils/taxesUtils')
const {recalculateAndValidateCoupon} = require('./controllerUtils/couponsUtils')
const {errorHandler} = require('../Utils/errorHandler') 


const ESTIMATED_DELIVERY_DATE = 5

// const createOrder = async (req, res, next)=> {
//     try {
//       console.log("Inside createOrder of orderController")
//       const userId = req.user._id
     
//       console.log("orderDetails---->", JSON.stringify(req.body))

//       const {paymentDetails, shippingAddressId} = req.body.orderDetails
//       let orderStatus = 'processing'
//       let deliveryDate;
//       if(paymentDetails.paymentMethod === 'cashOnDelivery'){
//         orderStatus = 'confirmed'
//         deliveryDate = new Date()
//         deliveryDate.setDate(deliveryDate.getDate() + ESTIMATED_DELIVERY_DATE)
//       }
  
//       const cart = await Cart.findOne({userId})
//       if (!cart || cart.products.length === 0){
//         return next(errorHandler(400, "Your cart is empty!"))
//       }
  
//       console.log("Cart found for checkout:", cart)
  
//       let orderTotal = 0
//       for (const item of cart.products) {
//         const product = await Product.findById(item.productId)
  
//         if (!product){
//           return next(errorHandler(404, `Product ${item.title} not found!`));
//         }
  
//         if (product.blocked){
//           return next(errorHandler(403, `Product ${item.title} is blocked and cannot be purchased.
//              Please remove this product from the cart or search for any alternative product and place Order`))
//         }
  
//         if (item.quantity > product.stock){
//           return next(errorHandler(400, `Insufficient stock for ${item.title}. Only ${product.stock} items available.
//              Please lessen the quantity and place Order`));
//         }
  
//         orderTotal += item.quantity * item.price
//       }
//       console.log("Order total:", orderTotal)
      
//       for (const item of cart.products){
//         const product = await Product.findById(item.productId)
//         product.stock -= item.quantity
//         await product.save()
//       }
      
//       const order = new Order({
//         userId,
//         products: cart.products,
//         orderTotal,
//         gst: cart.gst,
//         deliveryCharge: cart.deliveryCharge,
//         absoluteTotalWithTaxes: cart.absoluteTotalWithTaxes,
//         paymentDetails,
//         shippingAddress: shippingAddressId,
//         orderStatus,
//         orderDate: new Date(),
//         deliveryDate
//       })
  
//       await order.save()
//       console.log("Order created successfully:", order)
  
//       cart.products = []
//       cart.absoluteTotal = 0
//       await cart.save()
  
//       res.status(200).json({message: "Checkout successful! Your order has been placed.", order})
//     }catch(error){
//       console.log("Error in orderController-checkout:", error.message)
//       next(error)
//     }
//   }

const createOrder = async (req, res, next)=> {
    try {
        console.log("Inside createOrder of orderController")   
        const userId = req.user._id

        console.log("orderDetails---->", JSON.stringify(req.body))

        const { paymentDetails, shippingAddressId, couponCode } = req.body.orderDetails
        let orderStatus = 'processing'
        let deliveryDate
        if (paymentDetails.paymentMethod === 'cashOnDelivery'){
            orderStatus = 'confirmed'
            deliveryDate = new Date()
            deliveryDate.setDate(deliveryDate.getDate() + ESTIMATED_DELIVERY_DATE)
        }

        const cart = await Cart.findOne({ userId }).populate('products.productId')
        if (!cart || cart.products.length === 0){
            return next(errorHandler(400, "Your cart is empty!"))
        }

        console.log("Cart found for checkout:", cart)

        let orderTotal = 0
        let couponDiscounts = 0
        let deliveryPrice = cart.deliveryCharge
        let totalAmountWithTax = 0

        for (const item of cart.products){
          orderTotal += item.total
        }

        const {deliveryCharges, gstCharge, absoluteTotalWithTaxes} = calculateCharges(orderTotal, cart.products)
        cart.deliveryPrice = deliveryCharges
        cart.totalAmountWithTax  = absoluteTotalWithTaxes

        const now = new Date()

        let coupon = null
        if (couponCode || cart.couponUsed){
            if(couponCode){
              console.log("Inside if couponCode")
              coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
            }
            else{
              console.log("Inside if cart.couponUsed")
              coupon = await Coupon.findOne({ _id: cart.couponUsed })
            }
            
            const {absoluteTotalWithTaxes, couponDiscount, deliveryCharge} =
                await recalculateAndValidateCoupon(req, res, next, userId, coupon, cart.absoluteTotal, parseInt(deliveryCharges), parseInt(gstCharge))
   
            console.log(`absoluteTotalWithTaxes-----${absoluteTotalWithTaxes},couponDiscount------> ${couponDiscount}, deliveryCharge------>${deliveryCharge}`)
            deliveryPrice = deliveryCharge
            couponDiscounts = couponDiscount
            totalAmountWithTax = absoluteTotalWithTaxes
        }

        for (const item of cart.products){
            const product = await Product.findById(item.productId)
            if (!product || product.blocked) {
                return next(errorHandler(403, `Product ${item.title} is not available for purchase.`))
            }
            if (item.quantity > product.stock) {
                return next(errorHandler(400, `Insufficient stock for ${item.title}. Only ${product.stock} items available.`))
            }
            product.stock -= item.quantity
            await product.save()

            if(item.offerApplied){
              const offer = await Offer.findOne({_id: item.offerApplied}) 

              offer.usedCount += 1
              offer.lastUsedAt = new Date()

              const userUsage = offer.usedBy.find((usage) => usage.userId.toString() === userId.toString())
              if(userUsage){
                  userUsage.count += 1
              }else{
                  offer.usedBy.push({ userId, count: 1 })
              }

              const totalUsersApplied = offer.usedBy.reduce((acc, curr) => acc + curr.count, 0)
              offer.conversionRate = totalUsersApplied > 0
                  ? ((offer.usedCount / offer.redemptionCount) * 100).toFixed(2) : 0

              await offer.save()
            }
        }

        const order = new Order({
            userId,
            products: cart.products,
            orderTotal,
            couponDiscount: couponDiscounts,
            gst: gstCharge,
            deliveryCharge: deliveryPrice,
            absoluteTotalWithTaxes: totalAmountWithTax,
            paymentDetails,
            shippingAddress: shippingAddressId,
            orderStatus,
            orderDate: new Date(),
            deliveryDate,
            couponUsed: coupon ? coupon._id : null,
        });

        await order.save();
        console.log("Order created successfully:", order)

        if (coupon){
            coupon.usedCount += 1

            const userUsage = coupon.usedBy.find((usage)=> usage.userId.toString() === userId)
            if (userUsage) {
              userUsage.count += 1
            }else if(coupon.usageLimitPerCustomer){
              coupon.usedBy.push({ userId, count: 1 })
            }
            if(coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                coupon.status = "usedUp"
            }
            if(now > coupon.endDate) {
                coupon.status = "expired"
            }

            await coupon.save();
        }

        cart.products = []
        cart.absoluteTotal = 0
        await cart.save();

        res.status(200).json({ message: "Checkout successful! Your order has been placed.", order })
    }
    catch (error) {
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
    if (orderStatus && orderStatus != 'orders' && orderStatus != 'all') {
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
      filter.createdAt = {}
      if (startDate){
        if (isNaN(new Date(startDate))){
          next(errorHandler(400, "Invalid Date format!"))
        }
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate){
        if (isNaN(new Date(endDate))){
          next(errorHandler(400, "Invalid Date format!"))
        }
        filter.createdAt.$lte = new Date(endDate)
      }
    }

    console.log("filter--->", JSON.stringify(filter))
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

const getAllUsersOrders = async (req, res, next)=> {
  try {
    console.log("Inside getAllOrders of orderController")

    const { page = 1, limit = 10, orderStatus, sort = 'createdAt', month, startDate, endDate } = req.body.queryDetails || {}

    if (month && (startDate || endDate)){
      return next(errorHandler(409, "Invalid query--Cannot specify both 'month' and 'startDate'/'endDate'."))
    }

    const filter = {}
    if (orderStatus && orderStatus !== 'orders' && orderStatus !== 'all') {
      console.log("Filtering by orderStatus:", orderStatus)
      filter.orderStatus = orderStatus
    }

    const skip = (page - 1) * limit;

    if (month) {
      let requiredYear, requiredMonth
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      if(month <= currentMonth + 1){
        requiredMonth = currentMonth - month + 1
        requiredYear = currentDate.getFullYear()
      } else {
        requiredMonth = 12 - (month - (currentMonth + 1))
        requiredYear = currentDate.getFullYear() - 1
      }

      filter.createdAt = { $gte: new Date(requiredYear, requiredMonth, 1) }
    }

    if(startDate || endDate){
      filter.createdAt = {}
      if (startDate){
        if (isNaN(new Date(startDate))) {
          throw new Error("Invalid startDate format")
        }
        filter.createdAt.$gte = new Date(startDate)
      }
      if (endDate){
        if (isNaN(new Date(endDate))) {
          throw new Error("Invalid endDate format")
        }
        filter.createdAt.$lte = new Date(endDate)
      }
    }

    console.log("Filter applied:", JSON.stringify(filter))

    const orders = await Order.find(filter)
      .populate('userId', 'username email profilePic') 
      .populate('shippingAddress') 
      .sort({createdAt: sort})
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter)
    console.log("Orders retrieved:", JSON.stringify(orders));

    res.status(200).json({
      message: "All orders retrieved successfully",
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    })
  } catch (error){
    console.error("Error in getAllOrders:", error.message)
    next(error)
  }
}


const cancelOrderProduct = async (req, res, next) => {
  try {
    console.log("Inside cancelOrderProduct of orderController")
    const {orderId, productId, productCancelReason} = req.body

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
    if(productCancelReason.trim()){
      order.products[productIndex].productCancelReason = productCancelReason
    }
    await product.save()

    // order.products.splice(productIndex, 1);

    order.orderTotal -= canceledProduct.total
    order.absoluteTotalWithTaxes = order.orderTotal + order.gst + order.deliveryCharge

    order.products[productIndex].productStatus = "cancelled"
    if ( order.products.every(product=> product.productStatus === 'cancelled') ){
      order.orderStatus = "cancelled"
      order.orderCancelReason = productCancelReason
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
    const {orderCancelReason} = req.body
    // console.log(`orderId---> ${orderId} and orderCancelReason---> ${orderCancelReason}`)

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
      item.productStatus = 'cancelled'
    }
    
    if(orderCancelReason.trim()){
      order.orderCancelReason = orderCancelReason 
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


const deleteProductFromOrderHistory = async (req, res, next)=> {
  try {
    console.log("Inside deleteProductFromOrderHistory of orderController")
    const {orderId} = req.params
    const {productId} = req.body
    console.log(`orderId-->${orderId} and productId--->${productId}`)

    const order = await Order.findById(orderId)
    if(!order){
      return next(errorHandler(404, "Order not found!"))
    }

    const productIndex = order.products.findIndex( (item) => item.productId.toString() === productId )
    if(productIndex === -1){
      return next(errorHandler(404, "Product not found in the order!"))
    }
    const product = order.products[productIndex]
    if (product.productStatus !== "cancelled" && product.productStatus !== "refunded") {
      return next(errorHandler( 400, ' Only cancelled or refunded products can be deleted!' ))
    }
    product.isDeleted = true

    await order.save()

    console.log("Product marked as deleted successfully in the order history.")
    res.status(200).json({message: "Product successfully marked as deleted in the order history.", order})
  }catch (error){
    console.log("Error in deleteProductFromOrderHistory:", error.message)
    next(error)
  }
}


const changeOrderStatus = async (req, res, next)=> {
  try {
    console.log("Inside changeOrderStatus of orderController")
    const {orderId} = req.params
    const {newStatus} = req.body
    console.log(`orderId-->${orderId} and newStatus--->${newStatus}`)
    const order = await Order.findById(orderId)
    if (!order){
      return next(errorHandler(404, 'Order not found!'))
    }
    const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'returning', 'cancelled', 'refunded']
    const requiredStatus = validStatuses.find(status=> status.includes(newStatus.toLowerCase()))
    if (!requiredStatus){
      return next(errorHandler(400, 'Invalid order status!'))
    }
    order.orderStatus = requiredStatus

    order.products = order.products.map((product)=> ({ ...product, productStatus: requiredStatus}))

    await order.save();

    console.log("Updated the order and all the products of that order")
    return res.status(200).json({success: true, message: 'Order and product statuses updated successfully', updatedOrder: order})
  }catch (error){
    console.error('Error updating order status:', error.message)
    next(error)
  }
}


const changeProductStatus = async (req, res, next)=> {
  try {
    console.log("Inside changeOrderStatus of orderController")
    const {orderId, productId} = req.params
    const {newProductStatus} = req.body
    console.log(`orderId-->${orderId}, productId-->${productId} and newProductStatus--->${newProductStatus}`)

    const order = await Order.findById(orderId)
    if (!order){
      return next(errorHandler(404, 'Order not found!'))
    }

    const productIndex = order.products.findIndex( (product) => product.productId.toString() === productId )

    if (productIndex === -1){
      return next(errorHandler(404, 'Product not found in the order'))
    }
    const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'returning', 'cancelled', 'refunded']
    const requiredStatus = validStatuses.find(status=> status.includes(newProductStatus.toLowerCase()))
    if (!requiredStatus){
      return next(errorHandler(400, 'Invalid order status!'))
    }

    order.products[productIndex].productStatus = requiredStatus
    if(order.products.every(product=> product.productStatus === requiredStatus)){
      order.orderStatus = requiredStatus
    }

    await order.save();
    console.log("Updated the order and all the products of that order")
    return res.status(200).json({success: true, message: 'Product status updated successfully', updatedProduct: order.products[productIndex]})
  }catch(error){
    console.error('Error updating product status:', error.message)
    next(error)
  }
}


const getOrderCounts = async (req, res, next)=> {
  try {
    console.log("Inside getOrderCounts of orderController")
    const orderCounts = await Order.aggregate( [ { $group: {_id: '$orderStatus', count: { $sum: 1 }}} ])

    const statusCounts = {totalOrders: 0, cancelledOrders: 0, deliveredOrders: 0, returningOrders: 0}

    orderCounts.forEach(({ _id, count })=> {
      if (_id === 'cancelled') statusCounts.cancelledOrders = count;
      else if (_id === 'delivered') statusCounts.deliveredOrders = count;
      else if (_id === 'returning') statusCounts.returningOrders = count;
      statusCounts.totalOrders += count;
    })

    res.status(200).json({success: true, message: 'Order counts retrieved successfully', statusCounts});
  }catch(error){
    console.error('Error fetching order counts:', error.message)
    next(error)
  }
}



module.exports = {createOrder, getOrders, getAllUsersOrders, cancelOrderProduct, cancelOrder, deleteProductFromOrderHistory, 
        changeOrderStatus, changeProductStatus, getOrderCounts}