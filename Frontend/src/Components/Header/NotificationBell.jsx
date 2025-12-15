import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Bell, Package, Tag, TrendingUp, AlertCircle } from "lucide-react"
import axios from 'axios'
import {toast as sonnerToast} from 'sonner'

import NotificationItem from "./NotificationItem"


const mockNotifications = [
  {
    _id: 1,
    type: "order",
    title: "Order Shipped",
    message: "Your order #12345 has been shipped and is on its way!",
    created_At: "5 min ago",
    isRead: false,
    icon: Package,
  },
  {
    _id: 2,
    type: "promotion",
    title: "Flash Sale Alert",
    message: "Get 50% off on electronics. Limited created_At offer!",
    created_At: "1 hour ago",
    isRead: false,
    icon: Tag,
  },
  {
    _id: 3,
    type: "admin",
    title: "Account Update",
    message: "Your account settings have been updated successfully.",
    created_At: "2 hours ago",
    isRead: true,
    icon: AlertCircle,
  },
  {
    _id: 4,
    type: "stock",
    title: "Back in Stock",
    message: "The item you wishlisted is now back in stock!",
    created_At: "1 day ago",
    isRead: true,
    icon: TrendingUp,
  },
  {
    _id: 5,
    type: "order",
    title: "Order Delivered",
    message: "Your order #12344 has been delivered. Thank you for shopping!",
    created_At: "2 days ago",
    isRead: true,
    icon: Package,
  },
]

export default function NotificationBell({notificationSets, onNotificationRead, onAllNotifcationsRead}) {

  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([...mockNotifications])
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const [currentNotificationBatch, setCurrentNotificationBatch] = useState(1)
  const [hasMoreUsersNotifications, setHasMoreUsersNotifications] = useState(true)
  const limit = 5

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])


  const getNotifications = async()=> {
    console.log("Inside getNotifications()...") 
    if (!hasMoreUsersNotifications) return 
    try { 
      const response = await axios.get(`${baseApiUrl}/notifications?page=${currentNotificationBatch}&limit=${limit}`, { withCredentials: true })
      if(response.status === 200){
        console.log("response.data.notifications------>", response.data.notifications)
        setNotifications(prev=> ([...prev, ...response.data.notifications]))
        setHasMoreUsersNotifications(response.data.hasMore)
        setCurrentNotificationBatch(batch=> batch + 1)
      }
    }catch (error) {
      console.error("Error while fetching notifications:", error.message)
    }
  }


  useEffect(()=> {
    console.log("notificationSets----->", notificationSets)
    setNotifications(prev=> [...prev, ...notificationSets])
  }, [notificationSets])

  const handleMarkAsRead = (id) => {
    markNotificationRead(id)
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if(!isOpen) getNotifications()
          setIsOpen(!isOpen)
        }}
        className="relative pt-[7px] rounded-lg transition-colors text-white hover:text-primaryDark"
        aria-label="Notifications"
      >
        <Bell className="w-[22px] h-[22px]" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-[3px] -right-[7px] w-5 h-5 bg-primary text-secondary text-[10px] font-[600] rounded-full 
              flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-[8px] shadow-2xl border border-gray-200 overflow-hidden"
            style={{ transformOrigin: "top right" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && <p className="text-xs text-gray-600">{unreadCount} unread</p>}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={onAllNotifcationsRead}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No notifications</p>
                  <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification, index) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      index={index}
                      onMarkAsRead={onNotificationRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {hasMoreUsersNotifications && (
              <div 
                className="px-4 py-3 border-t border-gray-200 bg-gray-50"
                onClick={()=> getNotifications()}
              >
                <a
                  href="#"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium block text-center transition-colors"
                >
                  View all notifications
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
