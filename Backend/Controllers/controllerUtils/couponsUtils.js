
const Order = require("../../Models/orderModel")

const { errorHandler } = require("../../Utils/errorHandler")


const recalculateAndValidateCoupon = async (
    req,
    res,
    next,
    userId,
    cart,
    coupon,
    absoluteTotal,
    deliveryCharge,
    gstCharge,
) => {
    try {
        let couponWarning = ""
        let shouldCouponRemove = false
        if (!coupon || coupon.status !== "active") {
            shouldCouponRemove = true
            couponWarning = "Invalid or expired coupon code.Hence coupon wont be applicable"
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        const now = new Date()
        if (now < coupon.startDate || now > coupon.endDate) {
            shouldCouponRemove = true
            couponWarning = "Coupon is expired or not yet active. Hence coupon wont be applicable"
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        if (
            coupon.customerSpecific &&
            !coupon.assignedCustomers.some((user) => user.toString() === userId.toString())
        ) {
            shouldCouponRemove = true
            couponWarning = "This is a restricted users' coupon and cannot be applied to your account!"
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        const userOrderCount = await Order.countDocuments({
            userId,
            couponUsed: coupon._id,
            "paymentDetails.paymentStatus": "completed",
        })

        if (coupon.oneTimeUse && userOrderCount > 0) {
            shouldCouponRemove = true
            couponWarning = "This coupon can only be used once."
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        if (coupon.usageLimitPerCustomer !== null && userOrderCount >= coupon.usageLimitPerCustomer) {
            shouldCouponRemove = true
            couponWarning = "You have reached usage limit."
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        const totalUsage = await Order.countDocuments({
            couponUsed: coupon._id,
            "paymentDetails.paymentStatus": "completed",
        })

        if (coupon.usageLimit && totalUsage >= coupon.usageLimit) {
            shouldCouponRemove = true
            couponWarning = "Coupon usage limit reached."
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        let discountAmount = 0

        if (absoluteTotal < coupon.minimumOrderValue) {
            couponWarning = `Your order must be at least ₹ ${coupon.minimumOrderValue} to use this coupon.`
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        let isCouponApplicable = false
        for (const item of cart.products) {
            const product = item.productId
            if (
                coupon.applicableType === "allProducts" ||
                (coupon.applicableType === "products" &&
                    coupon.applicableProducts.some((id) => id.toString() === product._id.toString())) ||
                (coupon.applicableType === "categories" &&
                    product.category.some((catName) => coupon.applicableCategories.some((cat) => cat.name === catName)))
            ) {
                isCouponApplicable = true
                break
            }
        }

        if (!isCouponApplicable) {
            shouldCouponRemove = true
            couponWarning = "Coupon is not applicable to selected products."
            return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
        }

        if (isCouponApplicable) {
            if (coupon.discountType === "percentage") {
                const maxAllowed =
                    coupon.maxDiscount !== null && coupon.maxDiscount !== undefined ? coupon.maxDiscount : absoluteTotal

                discountAmount = Math.min(absoluteTotal * (coupon.discountValue / 100), maxAllowed)
            } else if (coupon.discountType === "fixed") {
                discountAmount = Math.min(coupon.discountValue, absoluteTotal)
            } else if (coupon.discountType === "freeShipping") {
                deliveryCharge = 0
            } else if (coupon.discountType === "buyOneGetOne") {
                let eligibleProducts = []

                for (const item of cart.products) {
                    const product = item.productId

                    if (
                        coupon.applicableType === "allProducts" ||
                        (coupon.applicableType === "products" &&
                            coupon.applicableProducts.some((id) => id.toString() === product._id.toString())) ||
                        (coupon.applicableType === "categories" &&
                            product.category.some((catName) =>
                                coupon.applicableCategories.some((cat) => cat.name === catName),
                            ))
                    ) {
                        eligibleProducts.push(item)
                    }
                }

                let expandedPrices = []

                for (const item of eligibleProducts) {
                    if (item.offerApplied) continue

                    for (let i = 0; i < item.quantity; i++) {
                        const unitPrice = item.total / item.quantity
                        expandedPrices.push(unitPrice)
                    }
                }

                if (expandedPrices.length < 2) {
                    couponWarning = "Buy One Get One coupon requires at least two eligible products."
                    return { couponDiscount: 0, deliveryCharge, shouldCouponRemove, couponWarning }
                } else {
                    expandedPrices.sort((a, b) => a - b)

                    let totalBOGODiscount = 0
                    const freeItemsCount = Math.floor(expandedPrices.length / 2)

                    for (let i = 0; i < freeItemsCount; i++) {
                        totalBOGODiscount += expandedPrices[i]
                    }

                    discountAmount = totalBOGODiscount
                }
            }
        }

        const finalTotal = absoluteTotal - discountAmount + gstCharge + deliveryCharge
        return {
            absoluteTotalWithTaxes: finalTotal,
            couponDiscount: discountAmount,
            deliveryCharge,
            shouldCouponRemove,
            couponWarning,
        }
    } catch (error) {
        console.error(error)
        return next(errorHandler(500, "Internal server error"))
    }
}


module.exports = { recalculateAndValidateCoupon }
