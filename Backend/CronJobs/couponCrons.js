const cron = require("node-cron")
const Coupon = require("../Models/couponModel")


cron.schedule("0 0 * * *", async ()=> {
  try {
    const now = new Date();

    const expiredResult = await Coupon.updateMany(
      { endDate: { $lt: now }, status: { $ne: "expired" } },
      { $set: { status: "expired" } }
    )

    const usedUpResult = await Coupon.updateMany(
      { usageLimit: { $ne: null }, $expr: { $gte: ["$usedCount", "$usageLimit"] }, status: { $ne: "usedUp" } },
      { $set: { status: "usedUp" } }
    )

    if (expiredResult.modifiedCount > 0 || usedUpResult.modifiedCount > 0) {
      console.log(
        `Coupon status cron ran successfully:
         Expired: ${expiredResult.modifiedCount}, 
         UsedUp: ${usedUpResult.modifiedCount}, 
         Time: ${now.toISOString()}`
      )
    }else {
      console.log(`Coupon cron ran at ${now.toISOString()} — no changes.`)
    }
  }
  catch (error) {
    console.error("Error running coupon cron job:", error.message)
  }
})
