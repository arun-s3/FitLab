const cron = require("node-cron")
const Category = require("../Models/categoryModel")


cron.schedule("0 0 * * *", async () => {
    const now = new Date()

    try {
        await Category.updateMany(
            {
                "seasonalActivation.startDate": { $lte: now },
                "seasonalActivation.endDate": { $gte: now },
                isActive: false,
            },
            { $set: { isActive: true } },
        )

        await Category.updateMany(
            {
                "seasonalActivation.endDate": { $lt: now },
                isActive: true,
            },
            { $set: { isActive: false } },
        )
    } catch (error) {
        console.error(error)
    }
})
