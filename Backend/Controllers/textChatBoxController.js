const TextChatBox = require("../Models/textChatBoxModel")
const User = require("../Models/userModel")


const getAdminChatHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 4
        const skip = (page - 1) * limit

        const allUserIds = await TextChatBox.distinct("userId")

        if (!allUserIds.length) {
            return res.status(200).json({ success: true, users: [], chats: {}, hasMore: false })
        }

        const paginatedUserIds = allUserIds.slice(skip, skip + limit)

        const users = await User.find({ _id: { $in: paginatedUserIds } })
            .select("-password -__v")
            .lean()
        const messages = await TextChatBox.find({
            userId: { $in: paginatedUserIds },
        })
            .sort({ timestamp: 1 })
            .lean()

        const userIdToUsername = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username
            return acc
        }, {})
        const groupedChats = {}

        messages.forEach((msg) => {
            const username = userIdToUsername[msg.userId.toString()]
            if (!username) return

            if (!groupedChats[username]) {
                groupedChats[username] = []
            }

            groupedChats[username].push(msg)
        })

        return res.status(200).json({
            success: true,
            page,
            hasMore: skip + limit < allUserIds.length,
            users,
            chats: groupedChats,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}


module.exports = { getAdminChatHistory }