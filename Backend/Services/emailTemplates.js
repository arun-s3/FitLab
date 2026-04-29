// services/emailTemplates.js

const sendContactConfirmation = async (sendEmail, { name, email }) => {
    return sendEmail({
        from: `"FitLab Support" <fitlab0101@gmail.com>`,
        to: email,
        subject: "We’ve received your message – FitLab",
        text: `Hi ${name},

                 Thank you for contacting FitLab. We’ve received your message and our team will get back to you shortly.

               – FitLab Support`,
    })
}

const sendOrderConfirmation = async (sendEmail, { name, email, orderId, amount }) => {
    return sendEmail({
        from: `"FitLab" <fitlab0101@gmail.com>`,
        to: email,
        subject: `Order Confirmed 🎉 | ${orderId}`,
        text: `Hi ${name},

                  Your order has been successfully placed! 🎉

                  Order ID: ${orderId}
                  Amount Paid: ₹${amount}

                  We’re currently processing your order and will update you once it’s shipped.

                  You can track your order anytime from your FitLab account.

                  If you need any help, just reply to this email or contact us in Fitlab—we’re happy to assist.

                Best regards,  
                Team FitLab`,
    })
}

module.exports = {
    sendContactConfirmation,
    sendOrderConfirmation,
}