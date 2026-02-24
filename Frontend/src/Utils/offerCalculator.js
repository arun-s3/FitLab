
export function calculateOfferPricing(offer, unitPrice, quantity = 1) {
    
    if (!unitPrice || quantity <= 0) {
        return {
            originalUnitPrice: 0,
            discountedUnitPrice: 0,
            totalOriginalPrice: 0,
            totalDiscount: 0,
            totalFinalPrice: 0,
            maxDiscountApplied: false,
        }
    }

    const totalOriginalPrice = unitPrice * quantity

    if (!offer) {
        return {
            originalUnitPrice: unitPrice,
            discountedUnitPrice: unitPrice,
            totalOriginalPrice,
            totalDiscount: 0,
            totalFinalPrice: totalOriginalPrice,
            maxDiscountApplied: false,
        }
    }

    let rawDiscount = 0
    let finalDiscount = rawDiscount
    let maxDiscountApplied = false

    if(offer?.offerOrOtherDiscount === 'offer') {
        
        if (offer.discountType === "percentage") {
            rawDiscount = (totalOriginalPrice * offer.discountValue) / 100
        } else if (offer.discountType === "fixed") {
            rawDiscount = offer.discountValue
        } else if (offer.discountType === "freeShipping") {
            rawDiscount = 0
        } else if (offer.discountType === "buyOneGetOne") {
            const freeItems = Math.floor(quantity / 2)
            rawDiscount = freeItems * unitPrice
        }
    
        if (offer.maxDiscount !== null && offer.maxDiscount !== undefined && rawDiscount > offer.maxDiscount) {
            finalDiscount = offer.maxDiscount
            maxDiscountApplied = true
        }
    }else {
        finalDiscount = offer.bestDiscount
    }

    const totalFinalPrice = Math.max(totalOriginalPrice - finalDiscount, 0)
    const discountedUnitPrice = totalFinalPrice / quantity

    return {
        originalUnitPrice: unitPrice,
        discountedUnitPrice,
        totalOriginalPrice,
        totalDiscount: finalDiscount,
        totalFinalPrice,
        maxDiscountApplied,
    }
}
