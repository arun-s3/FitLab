const Order = require("../Models/orderModel")
const Cart = require("../Models/cartModel")
const Product = require("../Models/productModel")
const Offer = require("../Models/offerModel")
const Coupon = require("../Models/couponModel")
const Payment = require("../Models/paymentModel")
const Wallet = require("../Models/walletModel")
const cloudinary = require("../Utils/cloudinary")

const { v4: uuidv4 } = require("uuid")

const { format } = require("date-fns")

const { calculateCharges } = require("./controllerUtils/taxesUtils")
const { recalculateAndValidateCoupon } = require("./controllerUtils/couponsUtils")
const { generateUniqueAccountNumber } = require("../Controllers/controllerUtils/walletUtils")
const { errorHandler } = require("../Utils/errorHandler")

const ESTIMATED_DELIVERY_DAYS = 5


function createOrderId() {
    const prefix = "#FITLAB_"
    const year = new Date().getFullYear().toString().slice(-2)
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}${year}-${randomNum}`
}


async function generateUniqueFitlabOrderId() {
    let orderId
    let exists = true

    while (exists) {
        orderId = createOrderId()
        const existingOrder = await Order.findOne({ fitlabOrderId: orderId })
        if (!existingOrder) {
            exists = false
        }
    }

    return orderId
}


const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { paymentDetails, shippingAddressId, couponCode } = req.body.orderDetails

        let orderStatus = "processing"
        let estimtatedDeliveryDate

        const cart = await Cart.findOne({ userId }).populate("products.productId")
        if (!cart || cart.products.length === 0) {
            return next(errorHandler(400, "Your cart is empty!"))
        }
        let orderTotal = 0
        let couponDiscounts = 0
        let deliveryPrice = cart.deliveryCharge
        let totalAmountWithTax = 0

        for (const item of cart.products) {
            orderTotal += item.total
        }

        const { deliveryCharges, gstCharge, absoluteTotalWithTaxes } = calculateCharges(orderTotal, cart.products)
        cart.deliveryPrice = deliveryCharges
        cart.totalAmountWithTax = absoluteTotalWithTaxes

        let currentAbsoluteTotalWithTaxes = absoluteTotalWithTaxes

        const now = new Date()
        let coupon = null
        if (couponCode || cart?.couponUsed) {
            if (couponCode) {
                coupon = await Coupon.findOne({ code: couponCode.toUpperCase() })
            } else {
                coupon = await Coupon.findOne({ _id: cart.couponUsed })
            }

            const { absoluteTotalWithTaxes, couponDiscount, deliveryCharge, shouldCouponRemove, couponWarning } =
                await recalculateAndValidateCoupon(
                    req,
                    res,
                    next,
                    userId,
                    cart,
                    coupon,
                    cart.absoluteTotal,
                    Number(deliveryCharges),
                    Number(gstCharge),
                )
            if (couponWarning) {
                if (shouldCouponRemove) {
                    cart.couponUsed = null
                    if (cart.couponDiscount) {
                        cart.couponDiscount = 0
                    }
                    cart.deliveryCharge = Number(deliveryCharges)
                    cart.absoluteTotalWithTaxes = Number(currentAbsoluteTotalWithTaxes)
                    await cart.save()
                    return next(errorHandler(403, couponWarning))
                }
            }

            deliveryPrice = deliveryCharge
            couponDiscounts = couponDiscount
            totalAmountWithTax = absoluteTotalWithTaxes
        }

        for (const item of cart.products) {
            const product = await Product.findById(item.productId)
            if (!product || product.isBlocked) {
                return next(errorHandler(403, `Some of the Products are not available for purchase.`))
            }
            if (item.quantity > product.stock) {
                return next(errorHandler(400, `Insufficient stock for some products! Please check again.`))
            }
        }

        const fitlabOrderId = await generateUniqueFitlabOrderId()

        orderStatus = "confirmed"
        estimtatedDeliveryDate = new Date()
        estimtatedDeliveryDate.setDate(estimtatedDeliveryDate.getDate() + ESTIMATED_DELIVERY_DAYS)

        const order = new Order({
            userId,
            fitlabOrderId,
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
            estimtatedDeliveryDate,
            couponUsed: coupon ? coupon._id : null,
        })

        await order.save()
        if (
            paymentDetails.paymentMethod === "razorpay" ||
            paymentDetails.paymentMethod === "stripe" ||
            paymentDetails.paymentMethod === "paypal"
        ) {
            const payment = await Payment.findOne({ paymentId: paymentDetails.transactionId })
            payment.orderId = order._id
            await payment.save()
        }

        for (const item of cart.products) {
            const result = await Product.updateOne(
                { _id: item.productId, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
            )
            if (result.modifiedCount === 0) {
                return next(errorHandler(403, "Stock changed. Try again."))
            }

            if (item.offerApplied) {
                const result = await Offer.updateOne(
                    {
                        _id: item.offerApplied,
                        "usedBy.userId": userId,
                    },
                    {
                        $inc: {
                            usedCount: 1,
                            completedCount: 1,
                            "usedBy.$.count": 1,
                        },
                        $set: { lastUsedAt: new Date() },
                    },
                )

                if (result.modifiedCount === 0) {
                    await Offer.updateOne(
                        { _id: item.offerApplied },
                        {
                            $inc: { usedCount: 1, completedCount: 1 },
                            $set: { lastUsedAt: new Date() },
                            $push: { usedBy: { userId, count: 1 } },
                        },
                    )
                }
            }
        }

        if (coupon) {
            const existingUserUpdate = await Coupon.updateOne(
                {
                    _id: coupon._id,
                    "usedBy.userId": userId,
                },
                {
                    $inc: {
                        usedCount: 1,
                        "usedBy.$.count": 1,
                    },
                },
            )

            if (existingUserUpdate.modifiedCount === 0) {
                await Coupon.updateOne(
                    { _id: coupon._id },
                    {
                        $inc: { usedCount: 1 },
                        $push: { usedBy: { userId, count: 1 } },
                    },
                )
            }

            if (coupon.usageLimit || coupon.endDate) {
                const updatedCoupon = await Coupon.findById(coupon._id).select("usedCount usageLimit endDate")

                let newStatus = null

                if (updatedCoupon.usageLimit && updatedCoupon.usedCount >= updatedCoupon.usageLimit) {
                    newStatus = "usedUp"
                }

                if (updatedCoupon.endDate && now > updatedCoupon.endDate) {
                    newStatus = "expired"
                }

                if (newStatus) {
                    await Coupon.updateOne({ _id: coupon._id }, { $set: { status: newStatus } })
                }
            }
        }

        cart.products = []
        cart.absoluteTotal = 0
        cart.couponUsed = null
        cart.couponDiscount = 0
        cart.deliveryCharge = 0
        cart.gst = 0
        cart.absoluteTotalWithTaxes = 0

        await cart.save()

        res.status(200).json({ message: "Checkout successful! Your order has been placed.", order })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getOrders = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { page = 1, limit = 10, orderStatus, sort, month, startDate, endDate } = req.body.queryDetails

        if (month && (startDate || endDate)) {
            return next(errorHandler(409, "Invalid query--Cannot specify both 'month' and 'startDate'/'endDate'."))
        }

        const filter = { userId }
        if (orderStatus && orderStatus != "orders" && orderStatus != "all") {
            filter.orderStatus = orderStatus
        }
        const skip = (page - 1) * limit

        if (month) {
            let requiredYear, requiredMonth
            const currentDate = new Date()
            const currentMonth = currentDate.getMonth()
            if (month <= currentMonth + 1) {
                requiredMonth = currentMonth - month + 1
                requiredYear = currentDate.getFullYear()
            } else {
                requiredMonth = 12 - (month - (currentMonth + 1))
                requiredYear = currentDate.getFullYear() - 1
            }

            filter.createdAt = { $gte: new Date(requiredYear, requiredMonth, 1) }
        }

        if (startDate || endDate) {
            filter.createdAt = {}
            if (startDate) {
                if (isNaN(new Date(startDate))) {
                    next(errorHandler(400, "Invalid Date format!"))
                }
                filter.createdAt.$gte = new Date(startDate)
            }
            if (endDate) {
                if (isNaN(new Date(endDate))) {
                    next(errorHandler(400, "Invalid Date format!"))
                }
                filter.createdAt.$lte = new Date(endDate)
            }
        }
        const orders = await Order.find(filter)
            .populate("shippingAddress")
            .populate("products.productId", "variantType weight color size motorPower")
            .sort({ createdAt: sort })
            .skip(skip)
            .limit(parseInt(limit))

        const totalOrders = await Order.countDocuments(filter)

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
            },
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getAllUsersOrders = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            orderStatus,
            sort = "createdAt",
            month,
            startDate,
            endDate,
        } = req.body.queryDetails || {}

        if (month && (startDate || endDate)) {
            return next(errorHandler(409, "Invalid query--Cannot specify both 'month' and 'startDate'/'endDate'."))
        }

        const filter = {}
        if (orderStatus && orderStatus !== "orders" && orderStatus !== "all") {
            filter.orderStatus = orderStatus
        }

        const skip = (page - 1) * limit

        if (month) {
            let requiredYear, requiredMonth
            const currentDate = new Date()
            const currentMonth = currentDate.getMonth()
            if (month <= currentMonth + 1) {
                requiredMonth = currentMonth - month + 1
                requiredYear = currentDate.getFullYear()
            } else {
                requiredMonth = 12 - (month - (currentMonth + 1))
                requiredYear = currentDate.getFullYear() - 1
            }

            filter.createdAt = { $gte: new Date(requiredYear, requiredMonth, 1) }
        }

        if (startDate || endDate) {
            filter.createdAt = {}
            if (startDate) {
                if (isNaN(new Date(startDate))) {
                    throw new Error("Invalid startDate format")
                }
                filter.createdAt.$gte = new Date(startDate)
            }
            if (endDate) {
                if (isNaN(new Date(endDate))) {
                    throw new Error("Invalid endDate format")
                }
                filter.createdAt.$lte = new Date(endDate)
            }
        }
        const orders = await Order.find(filter)
            .populate("userId", "username email profilePic")
            .populate("products.productId", "variantType weight color size motorPower")
            .populate("shippingAddress")
            .sort({ createdAt: sort })
            .skip(skip)
            .limit(parseInt(limit))

        const totalOrders = await Order.countDocuments(filter)
        res.status(200).json({
            message: "All orders retrieved successfully",
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
            },
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const cancelOrderProduct = async (req, res, next) => {
    try {
        const { orderId, productId, productCancelReason } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            return next(errorHandler(404, "Order not found!"))
        }

        const productIndex = order.products.findIndex((item) => item.productId.toString() === productId)
        if (productIndex === -1) {
            return next(errorHandler(404, "Product not found in the order!"))
        }
        const canceledProduct = order.products[productIndex]
        const product = await Product.findById(canceledProduct.productId)
        if (!product) {
            return next(errorHandler(404, "Product not found!"))
        }
        product.stock += canceledProduct.quantity
        if (productCancelReason.trim()) {
            order.products[productIndex].productCancelReason = productCancelReason
        }
        await product.save()

        order.orderTotal -= canceledProduct.total
        order.absoluteTotalWithTaxes = order.orderTotal + order.gst + order.deliveryCharge

        order.products[productIndex].productStatus = "cancelled"
        if (order.products.every((product) => product.productStatus === "cancelled")) {
            order.orderStatus = "cancelled"
            order.orderCancelReason = productCancelReason
        }

        await order.save()

        if (
            order.paymentDetails.paymentMethod !== "cashOnDelivery" &&
            order.paymentDetails.paymentStatus === "completed"
        ) {
            // WILL WRITE REFUND LOGIC LATER
        }

        res.status(200).json({ message: "Product successfully canceled from the order", order })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const { orderCancelReason } = req.body

        const order = await Order.findOne({ _id: orderId }).populate("products.productId")
        if (!order) {
            return next(errorHandler(404, "Order not found!"))
        }
        if (order.orderStatus === "cancelled") {
            return next(errorHandler(400, "Order has already been cancelled!"))
        }
        if (["delivered", "returning", "refunded"].includes(order.orderStatus)) {
            return next(errorHandler(403, "Order cannot be cancelled as it is already delivered or being returned"))
        }

        for (const item of order.products) {
            const product = await Product.findById(item.productId)
            if (product) {
                product.stock += item.quantity
                await product.save()
            }
            item.productStatus = "cancelled"
        }

        if (orderCancelReason.trim()) {
            order.orderCancelReason = orderCancelReason
        }
        order.orderStatus = "cancelled"
        await order.save()
        if (
            order.paymentDetails.paymentMethod !== "cashOnDelivery" &&
            order.paymentDetails.paymentStatus === "completed"
        ) {
            // WILL WRITE REFUND LOGIC LATER
        }

        res.status(200).json({ message: "Order cancelled successfully!", order })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const deleteProductFromOrderHistory = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const { productId } = req.body
        const order = await Order.findById(orderId)
        if (!order) {
            return next(errorHandler(404, "Order not found!"))
        }

        const productIndex = order.products.findIndex((item) => item.productId.toString() === productId)
        if (productIndex === -1) {
            return next(errorHandler(404, "Product not found in the order!"))
        }
        const product = order.products[productIndex]
        if (product.productStatus !== "cancelled" && product.productStatus !== "refunded") {
            return next(errorHandler(400, " Only cancelled or refunded products can be deleted!"))
        }
        product.isDeleted = true

        await order.save()
        res.status(200).json({ message: "Product successfully marked as deleted in the order history.", order })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const changeOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const { newStatus } = req.body
        const order = await Order.findById(orderId)
        if (!order) {
            return next(errorHandler(404, "Order not found!"))
        }
        const validStatuses = ["processing", "confirmed", "shipped", "delivered", "returning", "cancelled", "refunded"]
        const requiredStatus = validStatuses.find((status) => status.includes(newStatus.toLowerCase()))
        if (!requiredStatus) {
            return next(errorHandler(400, "Invalid order status!"))
        }
        order.orderStatus = requiredStatus

        if (requiredStatus === "delivered") {
            order.deliveryDate = new Date()
            if (order.paymentDetails.paymentMethod === "cashOnDelivery") {
                order.paymentDetails.paymentStatus = "completed"
            }
        }

        order.products = order.products.map((product) => ({ ...product, productStatus: requiredStatus }))

        await order.save()
        return res
            .status(200)
            .json({ success: true, message: "Order and product statuses updated successfully", updatedOrder: order })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const changeProductStatus = async (req, res, next) => {
    try {
        const { orderId, productId } = req.params
        const { newProductStatus } = req.body
        const order = await Order.findById(orderId)
        if (!order) {
            return next(errorHandler(404, "Order not found!"))
        }

        const productIndex = order.products.findIndex((product) => product.productId.toString() === productId)

        if (productIndex === -1) {
            return next(errorHandler(404, "Product not found in the order"))
        }
        const validStatuses = ["processing", "confirmed", "shipped", "delivered", "returning", "cancelled", "refunded"]
        const requiredStatus = validStatuses.find((status) => status.includes(newProductStatus.toLowerCase()))
        if (!requiredStatus) {
            return next(errorHandler(400, "Invalid order status!"))
        }

        order.products[productIndex].productStatus = requiredStatus
        if (order.products.every((product) => product.productStatus === requiredStatus)) {
            order.orderStatus = requiredStatus
        }

        if (requiredStatus === "delivered") {
            const otherDeliveredProducts = order.products.find((product) => product.productStatus === "delivered")
            if (!otherDeliveredProducts) {
                order.orderStatus = "delivered"
                order.deliveryDate = new Date()
                if (order.paymentDetails.paymentMethod === "cashOnDelivery") {
                    order.paymentDetails.paymentStatus = "completed"
                }
            }
        }

        await order.save()

        return res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            updatedProduct: order.products[productIndex],
            order,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getOrderCounts = async (req, res, next) => {
    try {
        const orderCounts = await Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }])

        const statusCounts = { totalOrders: 0, cancelledOrders: 0, deliveredOrders: 0, returningOrders: 0 }

        orderCounts.forEach(({ _id, count }) => {
            if (_id === "cancelled") statusCounts.cancelledOrders = count
            else if (_id === "delivered") statusCounts.deliveredOrders = count
            else if (_id === "returning") statusCounts.returningOrders = count
            statusCounts.totalOrders += count
        })

        res.status(200).json({ success: true, message: "Order counts retrieved successfully", statusCounts })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getTodaysLatestOrder = async (req, res, next) => {
    try {
        const userId = req.user._id

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const latestOrder = await Order.findOne({ userId, createdAt: { $gte: startOfDay, $lte: endOfDay } }).sort({
            createdAt: -1,
        })
        if (!latestOrder) {
            return next(errorHandler(500, "Internal Server Error!"))
        }

        return res
            .status(200)
            .json({ success: true, message: "Latest order for today fetched successfully!", order: latestOrder })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const checkIfUserBoughtProduct = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { productId } = req.params

        if (!productId) {
            return next(errorHandler(400, "Product ID is required"))
        }

        const order = await Order.findOne({
            userId,
            products: {
                $elemMatch: {
                    productId: productId,
                    productStatus: "delivered",
                },
            },
        })
        const hasPurchased = !!order
        return res.status(200).json({ success: true, hasPurchased })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const initiateReturn = async (req, res, next) => {
    try {
        const { orderId, productId, returnType, returnReason } = req.body
        if (!orderId || !returnType || !returnReason) {
            return next(errorHandler(400, "Missing required fields."))
        }

        const order = await Order.findOne({ _id: orderId }).populate("products.productId")
        if (!order) return next(errorHandler(404, "Order not found."))

        const uploadedImages = req.files?.images
            ? await Promise.all(
                  req.files["images"].map(async (image, index) => {
                      const result = await cloudinary.uploader.upload(image.path, {
                          folder: "returns/images",
                          resource_type: "image",
                          transformation: [{ width: 400, height: 400, crop: "limit" }],
                      })
                      return result.secure_url
                  }),
              )
            : []
        if (returnType === "product") {
            if (!productId) return next(errorHandler(400, "Product ID is required for product return."))

            const productInOrder = order.products.find((p) => p.productId.equals(productId))

            if (!productInOrder) return next(errorHandler(404, "This product was not found in your order."))

            productInOrder.productStatus = "returning"
            productInOrder.productReturnReason = returnReason
            productInOrder.productReturnImages = uploadedImages

            const allReturning = order.products.every((p) => p.productStatus === "returning")
            if (allReturning) {
                order.orderStatus = "returning"
            }

            await order.save()

            return res.status(200).json({
                success: true,
                message: "Product return initiated successfully.",
                updatedProduct: productInOrder,
            })
        } else if (returnType === "order") {
            order.orderStatus = "returning"
            order.orderReturnReason = returnReason
            order.orderReturnImages = uploadedImages

            order.products.forEach((p) => (p.productStatus = "returning"))

            await order.save()

            return res.status(200).json({
                success: true,
                message: "Order return initiated successfully.",
                updatedOrder: order,
            })
        } else {
            return next(errorHandler(400, "Invalid return type. Must be 'order' or 'product'."))
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const handleReturnDecision = async (req, res, next) => {
    try {
        const { orderId, productId, returnType, didAccept } = req.body.returnDetails
        if (!orderId || typeof didAccept === "undefined" || !returnType) {
            return next(errorHandler(400, "Missing required fields."))
        }

        const order = await Order.findById(orderId)
        if (!order) return next(errorHandler(404, "Order not found."))

        const decision = didAccept ? "accepted" : "rejected"

        if (returnType === "product") {
            if (!productId) return next(errorHandler(400, "Product ID is required for product-level return decision."))

            const productInOrder = order.products.find((p) => p.productId.equals(productId))
            if (!productInOrder) return next(errorHandler(404, "Product not found in this order."))
            productInOrder.productReturnStatus = decision

            if (decision === "rejected") {
                productInOrder.productStatus = "delivered"
            }

            const allAccepted = order.products.every((p) => p.productReturnStatus === "accepted")
            if (allAccepted) {
                order.orderReturnStatus = "accepted"
            }

            const allRejected = order.products.every((p) => p.productReturnStatus === "rejected")
            if (allRejected) {
                order.orderReturnStatus = "rejected"
                order.orderStatus = "delivered"
            }

            await order.save()

            return res.status(200).json({
                success: true,
                message: `Product return ${decision} successfully.`,
                updatedProduct: productInOrder,
                updatedOrderStatus: order.orderStatus,
            })
        } else if (returnType === "order") {
            order.orderReturnStatus = decision

            if (decision === "rejected") {
                order.orderStatus = "delivered"
                order.products.forEach((p) => {
                    if (p.productStatus === "returning") {
                        p.productStatus = "delivered"
                        p.productReturnStatus = "rejected"
                    }
                })
            } else if (decision === "accepted") {
                order.products.forEach((p) => {
                    p.productReturnStatus = "accepted"
                })
            }

            await order.save()

            return res.status(200).json({
                success: true,
                message: `Order return ${decision} successfully.`,
                updatedOrder: order,
            })
        } else {
            return next(errorHandler(400, "Invalid return type. Must be 'order' or 'product'."))
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const cancelReturnRequest = async (req, res, next) => {
    try {
        const { orderId, productId, returnType } = req.body.returnDetails
        if (!orderId || !returnType) {
            return next(errorHandler(400, "Missing required fields."))
        }

        const order = await Order.findById(orderId)
        if (!order) return next(errorHandler(404, "Order not found."))

        if (returnType === "product") {
            if (!productId) return next(errorHandler(400, "Product ID is required for product-level cancellation."))

            const productInOrder = order.products.find((p) => p.productId.equals(productId))
            if (!productInOrder) return next(errorHandler(404, "Product not found in this order."))

            if (productInOrder.productStatus !== "returning") {
                return next(errorHandler(400, "No return request exists for this product."))
            }

            productInOrder.productStatus = "delivered"
            productInOrder.productReturnReason = null
            productInOrder.productReturnImages = null
            productInOrder.productReturnStatus = null

            const anyReturning = order.products.some((p) => p.productStatus === "returning")
            if (!anyReturning) {
                order.orderStatus = "delivered"
                order.orderReturnReason = null
                order.orderReturnImages = null
                order.orderReturnStatus = null
            }

            await order.save()

            return res.status(200).json({ success: true, message: "Product return request cancelled successfully." })
        } else if (returnType === "order") {
            if (order.orderStatus !== "returning") {
                return next(errorHandler(400, "No order-level return request exists."))
            }

            order.orderStatus = "delivered"
            order.orderReturnReason = null
            order.orderReturnImages = null
            order.orderReturnStatus = null

            order.products.forEach((p) => {
                if (p.productStatus === "returning") {
                    p.productStatus = "delivered"
                    p.productReturnReason = null
                    p.productReturnImages = null
                    p.productReturnStatus = null
                }
            })

            await order.save()

            return res.status(200).json({ success: true, message: "Order return request cancelled successfully." })
        } else {
            return next(errorHandler(400, "Invalid return type. Must be 'order' or 'product'."))
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const processRefund = async (req, res, next) => {
    try {
        const { orderId, productId, refundType, fitlabAutoInitiated = { status: false } } = req.body.refundInfos
        if ((!orderId || !refundType) && !fitlabAutoInitiated.status)
            return next(errorHandler(400, "Missing required fields: orderId or refundType."))

        let order = null
        if (!fitlabAutoInitiated.status) {
            order = await Order.findById(orderId)
            if (!order) return next(errorHandler(404, "Order not found."))
        }

        let refundAmount = 0
        let refundedProducts = []

        if (refundType === "product" && !fitlabAutoInitiated.status) {
            if (!productId) return next(errorHandler(400, "Product ID is required for product refund."))

            const productInOrder = order.products.find((p) => p.productId.equals(productId))
            if (!productInOrder) return next(errorHandler(404, "Product not found in order."))

            if (productInOrder.productReturnStatus !== "accepted")
                return next(errorHandler(400, "Refund can only be processed for accepted returns."))

            refundAmount = productInOrder.total
            refundedProducts.push(productInOrder.title)

            productInOrder.productStatus = "refunded"

            const allRefunded = order.products.every((p) => p.productStatus === "refunded")
            if (allRefunded) {
                order.orderStatus = "refunded"
            }

            await order.save()
        } else if (refundType === "order" && !fitlabAutoInitiated.status) {
            if (order.orderReturnStatus !== "accepted" && !fitlabAutoInitiated.status)
                return next(errorHandler(400, "Refund can only be processed for accepted returns."))

            refundAmount = order.products.reduce((acc, p) => acc + p.total, 0)
            refundedProducts = order.products.map((p) => p.title)

            order.orderStatus = "refunded"
            order.products.forEach((p) => (p.productStatus = "refunded"))

            await order.save()
        }

        if (fitlabAutoInitiated.status) {
            refundAmount = fitlabAutoInitiated.refundAmount
        }

        const userId = fitlabAutoInitiated.status ? fitlabAutoInitiated.userId : order.userId
        const wallet = await Wallet.findOne({ userId })
        if (!wallet) {
            const uniqueAccountNumber = await generateUniqueAccountNumber()
            const newWallet = new Wallet({
                userId,
                accountNumber: uniqueAccountNumber,
                balance: 0,
                transactions: [],
            })
            await newWallet.save()
        }

        wallet.balance += refundAmount

        const refundTransaction = {
            type: "credit",
            amount: refundAmount,
            transactionId: uuidv4(),
            transactionAccountDetails: {
                type: "fitlab",
                account: "fitLab-order-refund",
            },
            notes: `Refund for ${refundType === "product" ? "product" : "order"}: ${refundedProducts.join(", ")}`,
            status: "refunded",
        }

        wallet.transactions.push(refundTransaction)
        await wallet.save()
        const message = fitlabAutoInitiated.status
            ? `Refund of ₹${refundAmount} processed successfully to wallet.`
            : `Your order could not be completed due to server error, so ₹${refundAmount} has been safely credited back to your wallet.`

        res.status(200).json({
            success: true,
            message,
            refundAmount,
            walletBalance: wallet.balance,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const generateInvoice = async (req, res, next) => {
    try {
        const { orderId } = req.params

        if (!orderId) return next(errorHandler(400, "Order ID is required"))

        const order = await Order.findById(orderId)
            .populate("userId", "name email")
            .populate("shippingAddress")
            .populate("products.productId")

        if (!order) return next(errorHandler(404, "Order not found"))

        const { jsPDF } = await import("jspdf")
        const doc = new jsPDF()

        let y = 20

        doc.setFontSize(18)
        doc.text("FITLAB - ORDER INVOICE", 70, y)
        y += 15

        doc.setFontSize(12)
        doc.text(`Invoice Date: ${format(new Date(), "dd MMM yyyy")}`, 15, y)
        y += 7
        doc.text(`Order ID: ${order.fitlabOrderId}`, 15, y)
        y += 7
        doc.text(`Order Date: ${format(order.orderDate, "dd MMM yyyy")}`, 15, y)
        y += 10

        doc.setFontSize(14)
        doc.text("Customer Details:", 15, y)
        y += 7
        doc.setFontSize(12)
        doc.text(`Name: ${order.userId.name}`, 15, y)
        y += 6
        doc.text(`Email: ${order.userId.email}`, 15, y)
        y += 6
        doc.text(
            `Shipping Address: ${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}`,
            15,
            y,
        )
        y += 10

        doc.setFontSize(13)
        doc.text("Products:", 15, y)
        y += 6
        doc.setFontSize(11)
        doc.text("Title", 15, y)
        doc.text("Qty", 110, y)
        doc.text("Price", 130, y)
        doc.text("Total", 160, y)
        y += 5
        doc.line(15, y, 200, y)
        y += 6

        order.products.forEach((item) => {
            const title = item.title.length > 35 ? item.title.slice(0, 35) + "..." : item.title
            doc.text(title, 15, y)
            doc.text(item.quantity.toString(), 112, y)
            doc.text(`${item.price.toFixed(2)}`, 132, y)
            doc.text(`${item.total.toFixed(2)}`, 162, y)
            y += 6
        })

        y += 5
        doc.line(15, y, 200, y)
        y += 8

        doc.setFontSize(13)
        doc.text("Order Summary", 15, y)
        y += 7
        doc.setFontSize(11)
        doc.text(`Subtotal: ${(order.orderTotal - order.gst - order.deliveryCharge).toFixed(2)}`, 15, y)
        y += 5
        doc.text(`GST: ${order.gst.toFixed(2)}`, 15, y)
        y += 5
        doc.text(`Delivery Charge: ${order.deliveryCharge.toFixed(2)}`, 15, y)
        y += 5
        doc.text(`Discount: ${order.discount.toFixed(2)}`, 15, y)
        y += 5
        doc.text(`Total Payable:  ${order.absoluteTotalWithTaxes.toFixed(2)}`, 15, y)
        y += 10

        doc.setFontSize(10)
        doc.text("Thank you for shopping with FitLab!", 70, y)
        y += 5
        doc.text("For any assistance, contact support@fitlab.com", 55, y)

        const pdfData = doc.output("arraybuffer")
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=invoice_${order.fitlabOrderId}.pdf`)
        res.send(Buffer.from(pdfData))
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = {
    createOrder,
    getOrders,
    getAllUsersOrders,
    cancelOrderProduct,
    cancelOrder,
    deleteProductFromOrderHistory,
    changeOrderStatus,
    changeProductStatus,
    initiateReturn,
    handleReturnDecision,
    cancelReturnRequest,
    processRefund,
    getOrderCounts,
    getTodaysLatestOrder,
    checkIfUserBoughtProduct,
    generateInvoice,
}