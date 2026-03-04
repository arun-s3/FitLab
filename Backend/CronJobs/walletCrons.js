const cron = require("node-cron")
const Wallet = require("../Models/walletModel")
const stripeLib = require("stripe")


module.exports = function walletCron(io) {

  cron.schedule("0 * * * *", async () => {
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
        const roomNames = [...io.sockets.adapter.rooms.keys()]
        const hasRoom = io.sockets.adapter.rooms.has(room)
        const socketsSet = await io.in(room).allSockets()
        let warnPayload
        
        if (!socketsSet.size) {
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
              io.to(room).emit("warnRazorpayRecharge", warnPayload)
              for (const sid of socketsSet) {
                try {
                  const socketInstance = io.sockets.sockets.get(sid)
                  if (socketInstance) {
                    socketInstance.emit("warnRazorpayRecharge", warnPayload);
                  }
                } catch (error) {
                    console.error(error)
                }
              }
            } catch (error) {
                console.error(error)
            }
          }

          if (paymentMethod === "stripe") {
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
                } catch (error) {
                    console.error(error)
                }
              }
            } catch (error) {
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
      console.error(error)
    }
  })
}
