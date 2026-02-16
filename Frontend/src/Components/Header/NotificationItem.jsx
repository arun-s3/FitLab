import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Bell, Package, Tag, TrendingUp, AlertCircle, X } from "lucide-react"


export default function NotificationItem({ notification, index, onMarkAsRead, onDelete }) {

  const [isHovered, setIsHovered] = useState(false)

  const notificationIcons = {
    'admin': AlertCircle,
    'order': Package,
    'offer': Package,
    'coupon': Package,
    'stock': TrendingUp,
  }

  const Icon = notificationIcons[notification.type] || null

  const getIconColor = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600"
      case "promotion":
        return "bg-orange-100 text-orange-600"
      case "admin":
        return "bg-purple-100 text-purple-600"
      case "stock":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  function formatNotificationTime(inputDate) {
    const date = new Date(inputDate)
    const now = new Date()

    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    const isToday = date.toDateString() === now.toDateString()

    const yesterday = new Date()
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    const formatTime = (d) =>
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

    const formatFullDate = (d) =>
      d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      formatTime(d)

    if (isToday) {
      if (diffMinutes < 1) return "Just now"
      if (diffMinutes < 60) return `${diffMinutes} min ago`
      return `${diffHours} hours ago`
    }

    if (isYesterday) {
      return `Yesterday at ${formatTime(date)}`
    }

    return formatFullDate(date)
  }


  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
      className={`relative px-4 py-3 cursor-pointer transition-colors ${
        notification.isRead ? "bg-white hover:bg-gray-50" : "bg-purple-50 hover:bg-purple-100"
      }`}
    >
      <div className="flex gap-3">
        {
          Icon &&
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}
            >
              <Icon className="w-5 h-5" />
            </div>
        }

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${notification.isRead ? "text-gray-800" : "text-gray-900"}`}>
              {notification.title}
            </h4>
            {!notification.isRead && <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-1.5"></span>}
          </div>
          <p className={`text-sm mt-0.5 line-clamp-2 ${notification.isRead ? "text-gray-600" : "text-gray-700"}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {!formatNotificationTime(notification.createdAt)?.includes('Invalid Date') ? formatNotificationTime(notification.createdAt) : null}
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification._id)
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
          aria-label="Delete notification"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
