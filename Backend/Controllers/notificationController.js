const Notification = require('../Models/notificationModel')

const {errorHandler} = require('../Utils/errorHandler') 


const getUserNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit

        const [notifications, totalCount] = await Promise.all([
            Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

            Notification.countDocuments({ userId }),
        ])
        return res.status(200).json({
            success: true,
            page,
            limit,
            total: totalCount,
            hasMore: skip + limit < totalCount,
            notifications,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const markNotificationAsRead = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const notification = await Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true })

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" })
        }

        return res.status(200).json({ success: true, message: "Notification marked as read", notification })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id

        await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } })

        return res.status(200).json({ success: true, message: "All notifications marked as read" })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = { getUserNotifications, markNotificationAsRead }



