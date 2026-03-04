const cron = require("node-cron")
const Coupon = require("../Models/couponModel")


cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date()

        await Coupon.updateMany({ endDate: { $lt: now }, status: { $ne: "expired" } }, { $set: { status: "expired" } })

        await Coupon.updateMany(
            { usageLimit: { $ne: null }, $expr: { $gte: ["$usedCount", "$usageLimit"] }, status: { $ne: "usedUp" } },
            { $set: { status: "usedUp" } },
        )
    } catch (error) {
        console.error(error)
    }
})
