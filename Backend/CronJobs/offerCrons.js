const cron = require("node-cron")
const Offer = require("../Models/offerModel")


cron.schedule("0 0 * * *", async ()=> {

  console.log("Running Offer Cron Job -", new Date().toLocaleString())

  try {
    const now = new Date()

    const expiredOffers = await Offer.updateMany(
      { endDate: { $lt: now }, status: { $ne: "expired" }, recurringOffer: false },
      { $set: { status: "expired" } }
    )

    const deactivatedOffers = await Offer.updateMany(
      { startDate: { $gt: now }, status: "active" },
      { $set: { status: "deactivated" } }
    )

    const recurringOffers = await Offer.find({
      recurringOffer: true,
      endDate: { $lt: now },
    })

    for (const offer of recurringOffers) {
      let nextStart = new Date(offer.startDate)
      let nextEnd = new Date(offer.endDate)

      switch (offer.recurringFrequency) {
        case "daily":
          nextStart.setDate(nextStart.getDate() + 1)
          nextEnd.setDate(nextEnd.getDate() + 1)
          break;
        case "weekly":
          nextStart.setDate(nextStart.getDate() + 7)
          nextEnd.setDate(nextEnd.getDate() + 7)
          break;
        case "monthly":
          nextStart.setMonth(nextStart.getMonth() + 1)
          nextEnd.setMonth(nextEnd.getMonth() + 1)
          break;
        case "yearly":
          nextStart.setFullYear(nextStart.getFullYear() + 1)
          nextEnd.setFullYear(nextEnd.getFullYear() + 1)
          break;
      }

      offer.startDate = nextStart;
      offer.endDate = nextEnd
      offer.status = "active"
      await offer.save();
    }

    console.log(
      `Offer Cron Job completed:
       Expired: ${expiredOffers.modifiedCount},
       Deactivated: ${deactivatedOffers.modifiedCount},
       Recurring Reset: ${recurringOffers.length}`
    )
  }
  catch (error) {
    console.error("Error in Offer Cron Job:", error.message)
  }
})
