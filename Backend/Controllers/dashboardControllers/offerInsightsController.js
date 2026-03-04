const Offer = require('../../Models/offerModel')
const Order = require('../../Models/orderModel')
const Product = require('../../Models/productModel')


const getOfferRevenueStats = async (req, res, next) => {
    try {
        const now = new Date()

        const todayStart = new Date(now)
        todayStart.setHours(0, 0, 0, 0)
        const todayEnd = new Date(now)
        todayEnd.setHours(23, 59, 59, 999)

        const yesterdayStart = new Date(todayStart)
        yesterdayStart.setDate(yesterdayStart.getDate() - 1)
        const yesterdayEnd = new Date(todayStart)
        yesterdayEnd.setMilliseconds(-1)

        const totalOfferResult = await Order.aggregate([
            {
                $match: {
                    orderDate: { $lte: todayEnd },
                    "products.offerApplied": { $ne: null },
                },
            },
            { $unwind: "$products" },
            {
                $match: { "products.offerApplied": { $ne: null } },
            },
            {
                $group: {
                    _id: null,
                    totalOfferRevenue: { $sum: "$products.offerDiscount" },
                },
            },
        ])
        const totalOfferRevenue = totalOfferResult[0]?.totalOfferRevenue || 0
        const yesterdayOfferResult = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: yesterdayStart, $lte: yesterdayEnd },
                    "products.offerApplied": { $ne: null },
                },
            },
            { $unwind: "$products" },
            {
                $match: { "products.offerApplied": { $ne: null } },
            },
            {
                $group: {
                    _id: null,
                    yesterdayOfferRevenue: { $sum: "$products.offerDiscount" },
                },
            },
        ])
        const yesterdayOfferRevenue = yesterdayOfferResult[0]?.yesterdayOfferRevenue || 0
        const todayOfferResult = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: todayStart, $lte: todayEnd },
                    "products.offerApplied": { $ne: null },
                },
            },
            { $unwind: "$products" },
            {
                $match: { "products.offerApplied": { $ne: null } },
            },
            {
                $group: {
                    _id: null,
                    todayOfferRevenue: { $sum: "$products.offerDiscount" },
                },
            },
        ])
        const todayOfferRevenue = todayOfferResult[0]?.todayOfferRevenue || 0
        let percentageChange = 0
        if (yesterdayOfferRevenue !== 0) {
            percentageChange = ((todayOfferRevenue - yesterdayOfferRevenue) / yesterdayOfferRevenue) * 100
        } else if (todayOfferRevenue !== 0) {
            percentageChange = 100
        }

        return res.status(200).json({
            totalOfferRevenue,
            yesterdayOfferRevenue,
            todayOfferRevenue,
            percentageChange: percentageChange.toFixed(2),
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getOfferStats = async (req, res, next) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

        const activeOffersCount = await Product.countDocuments({
            offerApplied: { $ne: null },
            "offerApplied.offerEndDate": { $gte: today },
        })
        const expiredOffersCount = await Product.countDocuments({
            offerApplied: { $ne: null },
            "offerApplied.offerEndDate": {
                $gte: startOfMonth,
                $lte: today,
            },
        })
        return res.status(200).json({
            activeOffersCount,
            expiredOffers: expiredOffersCount,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getTopUsedOffers = async (req, res, next) => {
    try {
        const offerUsageStats = await Order.aggregate([
            { $unwind: "$products" },
            { $match: { "products.offerApplied": { $ne: null } } },
            {
                $group: {
                    _id: "$products.offerApplied",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ])
        const totalOfferUsage = await Order.aggregate([
            { $unwind: "$products" },
            { $match: { "products.offerApplied": { $ne: null } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                },
            },
        ])
        const total = totalOfferUsage[0]?.total || 0

        const offerIds = offerUsageStats.map((stat) => stat._id)
        const offers = await Offer.find({ _id: { $in: offerIds } }).select("name")

        const offerIdToName = {}
        offers.forEach((offer) => {
            offerIdToName[offer._id.toString()] = offer.name
        })

        const response = offerUsageStats.map((stat) => ({
            name: offerIdToName[stat._id.toString()] || "Unknown",
            count: stat.count,
            percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0,
        }))
        return res.status(200).json({ mostUsedOffersData: response })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getMonthlyOfferStats = async (req, res, next) => {
    try {
        const currentYear = new Date().getFullYear()

        const monthOffersStats = await Promise.all(
            Array.from({ length: 12 }).map(async (_, index) => {
                const monthStart = new Date(currentYear, index, 1)
                const monthEnd = new Date(currentYear, index + 1, 0, 23, 59, 59, 999)

                const activeCount = await Offer.countDocuments({
                    status: "active",
                    startDate: { $gte: monthStart, $lte: monthEnd },
                })

                const expiredCount = await Offer.countDocuments({
                    status: "expired",
                    endDate: { $gte: monthStart, $lte: monthEnd },
                })

                return {
                    name: monthStart.toLocaleString("default", { month: "short" }),
                    active: activeCount,
                    expired: expiredCount,
                }
            }),
        )
        res.status(200).json({ monthOffersStats })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getOffersCountByUserGroup = async (req, res, next) => {
    try {
        const targetGroupMap = {
            all: "All Users",
            newUsers: "New Users",
            returningUsers: "Returning Users",
            VIPUsers: "VIP Users",
        }

        const offers = await Offer.find()
        const resultMap = {}

        for (const offer of offers) {
            const groupKey = targetGroupMap[offer.targetUserGroup] || offer.targetUserGroup

            if (!resultMap[groupKey]) resultMap[groupKey] = { type: groupKey }

            resultMap[groupKey][offer.name] = offer.usedCount
        }

        const resultArray = Object.values(resultMap)
        res.status(200).json({ offersByUserGroups: resultArray })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = {
    getOfferRevenueStats,
    getOfferStats,
    getTopUsedOffers,
    getMonthlyOfferStats,
    getOffersCountByUserGroup,
}
