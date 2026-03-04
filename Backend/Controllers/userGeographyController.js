const User = require('../Models/userModel')
const Address = require('../Models/addressModel')
const Order = require('../Models/orderModel')


const getCustomerHeatmapData = async (req, res, next) => {
    try {
        const result = await Address.aggregate([
            {
                $group: {
                    _id: "$state",
                    customers: { $addToSet: "$userId" },
                },
            },
            {
                $project: {
                    state: "$_id",
                    _id: 0,
                    customerCount: { $size: "$customers" },
                },
            },
            { $sort: { customerCount: -1 } },
        ])
        res.status(200).json({ usersLocationData: result })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const getUserAndOrderStatsByState = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments()

        const userLocation = await Address.aggregate([
            {
                $group: {
                    _id: "$state",
                    userCount: { $addToSet: "$userId" },
                },
            },
            {
                $project: {
                    state: "$_id",
                    userCount: { $size: "$userCount" },
                    _id: 0,
                },
            },
            {
                $sort: { userCount: -1 },
            },
            { $limit: 1 },
        ])
        const topUserLocation = userLocation[0] || { state: null, userCount: 0 }
        const orderLocation = await Order.aggregate([
            {
                $lookup: {
                    from: "addresses",
                    localField: "shippingAddress",
                    foreignField: "_id",
                    as: "addressInfo",
                },
            },
            {
                $unwind: "$addressInfo",
            },
            {
                $group: {
                    _id: "$addressInfo.state",
                    orderCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    state: "$_id",
                    orderCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { orderCount: -1 },
            },
            { $limit: 1 },
        ])
        const topOrderLocation = orderLocation[0] || { state: null, orderCount: 0 }

        res.status(200).json({
            totalUsers,
            topUserLocation: topUserLocation.state,
            topOrderLocation: topOrderLocation.state,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = { getCustomerHeatmapData, getUserAndOrderStatsByState }
