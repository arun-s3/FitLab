const Product = require("../../Models/productModel")
const Category = require("../../Models/categoryModel")
const Cart = require("../../Models/cartModel")
const Order = require("../../Models/orderModel")
const Offer = require("../../Models/offerModel")

const { errorHandler } = require("../../Utils/errorHandler")

const VIP_SPENDING_TRESHHOLD = 100000
const USER_INACTIVE_PERIOD = 6 * 30 * 24 * 60 * 60 * 1000


const findUserGroup = async (userId) => {
    try {
        const lastOrder = await Order.findOne({ userId, "paymentDetails.paymentStatus": "completed" }).sort({
            orderDate: -1,
        })
        let userType =
            !lastOrder || lastOrder == null
                ? "newUsers"
                : Date.now() - new Date(lastOrder.orderDate).getTime() > USER_INACTIVE_PERIOD
                  ? "returningUsers"
                  : "all"
        const totalSpent = await Order.aggregate([
            { $match: { userId, "paymentDetails.paymentStatus": "completed" } },
            { $group: { _id: null, totalSpent: { $sum: "$absoluteTotalWithTaxes" } } },
        ])

        userType = !totalSpent.length ? userType : totalSpent[0].totalSpent >= VIP_SPENDING_TRESHHOLD ? "VIP" : userType
        return userType
    } catch (error) {
        console.error(error)
        errorHandler(500, "Internal Server Error.")
    }
}


const calculateBestOffer = async (userId, productId, quantity) => {
    try {
        const product = await Product.findById(productId)
        if (!product) {
            errorHandler(404, "Product not found!")
        }
        const cart = await Cart.findOne({ userId })
        let existingQuantity = 0

        if (cart) {
            const existingItem = cart.products.find((item) => item.productId.toString() === productId.toString())
            if (existingItem) {
                existingQuantity = existingItem.quantity
            }
        }

        const finalQuantity = existingQuantity + quantity
        const userType = await findUserGroup(userId)
        const orderValue = product.price * finalQuantity

        const offers = await Offer.find({
            targetUserGroup: { $in: [userType, "all"] },
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            status: "active",
            $or: [{ minimumOrderValue: { $exists: false } }, { minimumOrderValue: { $lte: orderValue } }],
        })

        let discount = 0
        let bestDiscount = 0
        let offerDiscountType = null
        let bestOffer = null
        let maxOfferDiscountApplied = false
        let offerDetails = null

        const calculateDiscount = (offer) => {
            if (offer.discountType === "percentage") {
                discount = (product.price * finalQuantity * offer.discountValue) / 100
                if (offer?.maxDiscount) {
                    discount = Math.min(discount, offer.maxDiscount)
                    if (discount === offer.maxDiscount) {
                        maxOfferDiscountApplied = true
                    }
                }
            } else if (offer.discountType === "fixed") {
                discount = offer.discountValue
                if (offer?.maxDiscount) {
                    discount = Math.min(discount, offer.maxDiscount)
                }
            }
    
            if (discount > bestDiscount) {
                bestDiscount = discount
                offerDetails = offer
                bestOffer = offer._id
                offerDiscountType = offer.discountType
            }
        }

        const categoryIds = await Category.find({ name: { $all: product.category } }, { _id: 1 })
        offers.forEach((offer) => {
            if (
                offer.applicableType === "categories" &&
                categoryIds.some((id) => offer.applicableCategories.includes(id._id))
            ) {
                calculateDiscount(offer)
            }
            if (offer.applicableType === "products" && offer.applicableProducts.includes(productId.toString())) {
                calculateDiscount(offer)
            }
            if (offer.applicableType === "allProducts") {
                calculateDiscount(offer)
            }
        })

        // PRODUCT DISCOUNT 
        let productDiscount = 0

        if (product.discountType) {
            if (product.discountType === "fixed") {
                productDiscount = product.maxDiscount
                    ? Math.min(product.discountValue, product.maxDiscount)
                    : product.discountValue
            } else if (product.discountType === "percentage") {
                const calculated = (product.price * finalQuantity * product.discountValue) / 100
                productDiscount = product.maxDiscount ? Math.min(calculated, product.maxDiscount) : calculated
            }
        }

        // CATEGORY DISCOUNT
        let bestCategoryDiscount = 0
        let bestCategory = null

        const categories = await Category.find({
            name: { $in: product.category },
            isBlocked: false,
            isActive: true,
        })

        categories.forEach((cat) => {
            if (!cat.discount || cat.discount <= 0) return

            const now = new Date()
            if (cat.seasonalActivation?.startDate && cat.seasonalActivation?.endDate) {
                if (now < cat.seasonalActivation.startDate || now > cat.seasonalActivation.endDate) {
                    return
                }
            }

            const categoryDiscount = (product.price * finalQuantity * cat.discount) / 100
            if (categoryDiscount > bestCategoryDiscount) {
                bestCategoryDiscount = categoryDiscount
                bestCategory = cat
            }
        })

        let nonOfferDiscountValue = 0

        if (productDiscount > bestDiscount && productDiscount > bestCategoryDiscount) {
            bestDiscount = productDiscount
            bestOffer = "productDiscount"
            offerDiscountType = product.discountType
            nonOfferDiscountValue = product.discountValue
        } else if (bestCategoryDiscount > bestDiscount && bestCategoryDiscount > productDiscount) {
            bestDiscount = bestCategoryDiscount
            bestOffer = "categoryDiscount"
            offerDiscountType = "percentage"
            nonOfferDiscountValue = bestCategory.discount
        }

        let offerOrOtherDiscount = null

        if (bestOffer == null) {
            offerOrOtherDiscount = { offerOrOtherDiscount: null }
        } else if (bestOffer === "productDiscount") {
            offerOrOtherDiscount = { offerOrOtherDiscount: "product" }
            bestOffer = null
        } else if (bestOffer === "categoryDiscount") {
            offerOrOtherDiscount = { offerOrOtherDiscount: "category" }
            bestOffer = null
        } else {
            offerOrOtherDiscount = { offerOrOtherDiscount: "offer" }
        }

        return {
            offerDiscountType,
            bestDiscount,
            maxOfferDiscountApplied,
            offerApplied: bestOffer,
            offerDetails,
            actualProductQuantity: finalQuantity,
            nonOfferDiscountValue,
            ...offerOrOtherDiscount,
        }
    } catch (error) {
        console.error(error)
        errorHandler(500, "Internal Server Error.")
    }
}


module.exports = { findUserGroup, calculateBestOffer }
