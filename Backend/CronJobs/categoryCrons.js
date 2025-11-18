const cron = require("node-cron")
const Category = require("../Models/categoryModel")


cron.schedule("0 0 * * *", async () => {
  const now = new Date()

  try {
    const activateResult = await Category.updateMany(
      {
        "seasonalActivation.startDate": { $lte: now },
        "seasonalActivation.endDate": { $gte: now },
        isActive: false
      },
      { $set: { isActive: true } }
    )

    const deactivateResult = await Category.updateMany(
      {
        "seasonalActivation.endDate": { $lt: now },
        isActive: true
      },
      { $set: { isActive: false } }
    )

    if (activateResult.modifiedCount > 0 || deactivateResult.modifiedCount > 0) {
      console.log(`Seasonal categories updated | Activated: ${activateResult.modifiedCount}, 
        Deactivated: ${deactivateResult.modifiedCount}`)
    }
  }
  catch (error) {
    console.error("Error updating seasonal categories:", error.message)
  }
})
