const cron = require("node-cron")
const Wallet = require("../Models/walletModel")
const stripeLib = require("stripe")

module.exports = function walletCron(io) {

  cron.schedule("* * * * *", async () => {
    console.log("Checking auto-recharge wallets...")

    console.log("IO exists?", !!global.io)
    console.log("io === global.io ?", io === global.io)

    const stripe = stripeLib(process.env.STRIPE_SECRET_KEY)

    try {
      const allWallets = await Wallet.find({ "autoRecharge.isEnabled": true });
      const wallets = allWallets.filter(
        (w) => w.balance < w.autoRecharge.thresholdAmount
      )

      for (const wallet of wallets) {
        const { userId, balance, autoRecharge } = wallet
        const { paymentMethod, rechargeAmount } = autoRecharge
        const room = String(userId)

        console.log(
          `userId--->${userId}, balance--->${balance}, paymentMethod--->${paymentMethod} and rechargeAmount--->${rechargeAmount}`
        )

        const roomNames = [...io.sockets.adapter.rooms.keys()]
        console.log("Room names:", roomNames.length ? roomNames : "(no rooms?)")

        const hasRoom = io.sockets.adapter.rooms.has(room)
        console.log(`Has room ${room}?`, hasRoom)

        const socketsSet = await io.in(room).allSockets()
        console.log(`Sockets in ${room}:`, socketsSet.size ? [...socketsSet] : "(none)")

        let warnPayload
        
        if (!socketsSet.size) {
          console.log(`No connected sockets for user ${room} — skipping emit.`)
        } else {
          warnPayload = {
            amount: rechargeAmount,
            balance: wallet.balance,
            method: paymentMethod,
          };
        }

        if (autoRecharge.isEnabled && balance < autoRecharge.thresholdAmount && autoRecharge.needsRecharge === true) {

          if(paymentMethod === "razorpay"){
            try {
              console.log("Attempting room emit to", room)
              io.to(room).emit("warnRazorpayRecharge", warnPayload)
              for (const sid of socketsSet) {
                try {
                  const socketInstance = io.sockets.sockets.get(sid)
                  if (socketInstance) {
                    socketInstance.emit("warnRazorpayRecharge", warnPayload);
                  }
                } catch (err) {
                  console.log("Error emitting to individual socket", sid, err.message)
                }
              }
              console.log("Room + individual emits attempted for warnRazorpayRecharge")
            } catch (err) {
              console.log("Error during room emit:", err.message)
            }
          }

          if (paymentMethod === "stripe") {
            console.log("Triggering Stripe auto-recharge for", userId)
            try {
              const paymentIntent = await stripe.paymentIntents.create({
                amount: rechargeAmount * 100,
                currency: "INR",
                customer: autoRecharge.customerId,
                payment_method: autoRecharge.paymentMethodId,
                off_session: true,
                confirm: true,
              })

              wallet.transactions.push({
                type: "auto-recharge",
                amount: rechargeAmount,
                transactionId: paymentIntent.id,
                transactionAccountDetails: { type: "gateway", account: "stripe" },
                status: "success",
                notes: "Stripe auto-recharge processed",
              })

              wallet.balance += rechargeAmount
              wallet.autoRecharge.needsRecharge = false
              await wallet.save();

              console.log("Successfully completed stripe auto-recharge for", userId)

              const successPayload = {
                amount: rechargeAmount,
                balance: wallet.balance,
                method: paymentMethod,
              };

              const socketsAfter = await io.in(room).allSockets()
              if (socketsAfter.size) {
                try {
                  io.to(room).emit("walletRechargeSuccess", successPayload)
                  for (const sid of socketsAfter) {
                    const fsArr = await io.in(room).fetchSockets()
                    for (const fs of fsArr) {
                      fs.emit && fs.emit("walletRechargeSuccess", successPayload);
                    }
                  }
                  console.log("walletRechargeSuccess emitted to room and sockets")
                } catch (err) {
                  console.log("Error emitting walletRechargeSuccess:", err.message)
                }
              } else {
                console.log("No sockets present to send walletRechargeSuccess for", room)
              }
            } catch (error) {
              console.log("Stripe Auto-Recharge Failed:", error.message)

              wallet.transactions.push({
                type: "auto-recharge",
                amount: rechargeAmount,
                transactionId: `stripe_failed_${Date.now()}`,
                transactionAccountDetails: { type: "gateway", account: "stripe" },
                status: "failed",
                notes: error.message,
              })

              await wallet.save();
            }
          }

          wallet.autoRecharge.needsRecharge = false
          await wallet.save();
        }
      }
    } catch (error) {
      console.log("Cron Auto-Recharge Error:", error.message)
    }
  })
}
