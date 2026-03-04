const GST_GYM_PERCENTAGE = 0.18
const GST_SUPPLEMENTS_PERCENTAGE = 0.12
const FREE_DELIVERY_THRESHOLD = 20000
const STANDARD_DELIVERY_CHARGE = 500


const calculateCharges = (absoluteTotal, products) => {
    if (!absoluteTotal || absoluteTotal <= 0) {
        return {
            deliveryCharges: 0,
            gstCharge: 0,
            absoluteTotalWithTaxes: 0,
        }
    }

    let totalGST = 0
    let actualDeliveryCharge = 0

    products.forEach((product) => {
        let gstRate = GST_GYM_PERCENTAGE
        if (product.category.some((cat) => cat === "supplements")) gstRate = GST_SUPPLEMENTS_PERCENTAGE

        const taxableAmount = product.total
        const productGST = taxableAmount * gstRate
        totalGST += productGST

        if (product?.weight && product.offerDiscountType !== "freeShipping") {
            actualDeliveryCharge += product.weight > 15 ? 200 : 50
        }
    })

    let deliveryCharges =
        absoluteTotal >= FREE_DELIVERY_THRESHOLD ? 0 : Math.max(actualDeliveryCharge, STANDARD_DELIVERY_CHARGE)

    const absoluteTotalWithTaxes = absoluteTotal + deliveryCharges + totalGST
    return {
        deliveryCharges: deliveryCharges?.toFixed(2),
        gstCharge: totalGST?.toFixed(2),
        absoluteTotalWithTaxes: absoluteTotalWithTaxes?.toFixed(2),
    }
}


module.exports = { calculateCharges }
