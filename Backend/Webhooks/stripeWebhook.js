const Stripe = require('stripe')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Wallet = require('../Models/walletModel')

const {errorHandler} = require('../Utils/errorHandler') 


const handleStripeWebhook = async (req, res, next) => {

  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  }catch(error){
    console.error('Webhook signature verification failed:', error.message)
    return next(errorHandler(400, `Webhook Error: ${error.message}`))
  }

  console.log('Stripe Event:', event.type)

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object
    const subscriptionId = invoice.subscription
    const amountPaid = invoice.amount_paid / 100 

    const wallet = await Wallet.findOne({ "autoRecharge.subscriptionId": subscriptionId })
    if (wallet) {
      wallet.balance += amountPaid
      wallet.autoRecharge.lastRecharge = new Date()

      wallet.transactions.push({
        type: 'auto-recharge',
        amount: wallet.autoRecharge.rechargeAmount,
        transactionId: invoice.payment_intent,       
        transactionAccountDetails: {
          type: 'gateway',
          account: 'stripe'
        },
        notes: 'Automatic wallet recharge',
        status: 'success',
        createdAt: new Date()
      })  

      await wallet.save()
      console.log(`Wallet auto-recharged ₹${amountPaid} for user ${wallet.user} via Stripe!`)
    }
  }

  res.status(200).json({success: true})
}


module.exports = {handleStripeWebhook}