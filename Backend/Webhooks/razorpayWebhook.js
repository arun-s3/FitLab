// const Wallet = require('../Models/walletModel')
// const crypto = require("crypto")

// const {errorHandler} = require('../Utils/errorHandler') 


// const handleRazorpayWebhook = async (req, res, next) => {
//   try {
//     const signature = req.headers['x-razorpay-signature'];
//     const body = JSON.stringify(req.body);

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest('hex');

//     if (expectedSignature !== signature) {
//       console.warn('Invalid webhook signature');
//       return next(errorHandler(400, 'Invalid signature'));
//     }

//     const event = req.body.event;

//     if (event === 'invoice.paid' || event === 'subscription.charged') {
//       const subscription = (req.body.payload && (req.body.payload.subscription || req.body.payload.invoice))?.entity;
//       const payment = (req.body.payload && req.body.payload.payment && req.body.payload.payment.entity) || (req.body.payload && req.body.payload.invoice && req.body.payload.invoice.entity && req.body.payload.invoice.entity.payment) ;

//       const subscriptionId =
//         (req.body.payload && req.body.payload.subscription && req.body.payload.subscription.entity && req.body.payload.subscription.entity.id) ||
//         (req.body.payload && req.body.payload.invoice && req.body.payload.invoice.entity && req.body.payload.invoice.entity.subscription_id);

//       const paymentEntity = req.body.payload?.payment?.entity || req.body.payload?.invoice?.entity?.payment;

//       if (!subscriptionId || !paymentEntity) {
//         return res.status(200).json({ success: true });
//       }

//       const amount = (paymentEntity.amount || 0) / 100;
//       const transactionId = paymentEntity.id || `rzp_tx_${Date.now()}`;

//       const wallet = await Wallet.findOne({ 'autoRecharge.subscriptionId': subscriptionId });
//       if (!wallet) {
//         console.warn('No wallet found for subscription:', subscriptionId);
//         return res.status(200).json({ success: true });
//       }

//       wallet.balance = Number(wallet.balance || 0) + Number(amount);
//       wallet.autoRecharge.lastRecharge = new Date();
//       wallet.autoRecharge.needsRecharge = false;

//       wallet.transactions.push({
//         type: 'auto-recharge',
//         amount: amount,
//         transactionId: transactionId,
//         transactionAccountDetails: {
//           type: 'gateway',
//           account: 'razorpay',
//         },
//         notes: 'Automatic wallet recharge via Razorpay mandate',
//         status: 'success',
//         createdAt: new Date(),
//       });

//       await wallet.save();


//       console.log(`Wallet ${wallet.userId} recharged ₹${amount} via Razorpay mandate`);

//       return res.status(200).json({ success: true });
//     }

//     return res.status(200).json({ success: true });


//   } catch (error) {
//     console.error("Webhook Error:", error)
//     next(error)
//   }
// }


// module.exports = {handleRazorpayWebhook}