import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Bell } from "lucide-react"
import apiClient from "../../Api/apiClient"

import NotificationItem from "./NotificationItem"


export default function NotificationBell({notifications, setNotifications, onNotificationRead, onAllNotifcationsRead, 
  onNotificationDelete, containerStyle, bellStyle}) {

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const [unreadCount, setUnreadCount] = useState(null)

  const [currentNotificationBatch, setCurrentNotificationBatch] = useState(1)
  const [hasMoreUsersNotifications, setHasMoreUsersNotifications] = useState(true)
  const limit = 5

  const [fetchError, setFetchError] = useState(false)

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
    if (!hasMoreUsersNotifications) return 
    try { 
      const response = await apiClient.get(`${baseApiUrl}/notifications?page=${currentNotificationBatch}&limit=${limit}`)
      if(response.status === 200){
        setNotifications(response.data.notifications)
        setHasMoreUsersNotifications(response.data.hasMore)
        setCurrentNotificationBatch(batch=> batch + 1)
      }
    }catch (error) {
      if (!error.response) {
        setFetchError("Error while loading notifications, due to network error. Please check your internet.")
      }else {
        setFetchError("Error while loading notifications, due to server issues.")
      }
    }
  }

  useEffect(()=> {
    getNotifications()
  }, [])

  useEffect(()=> {
    if(notifications && notifications?.length > 0){
      setUnreadCount(notifications.filter((n) => !n.isRead).length)
    }
  }, [notifications])


  return (
    <div className={`${containerStyle ? containerStyle : 'relative'}`}>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="relative pt-[7px] rounded-lg transition-colors text-white hover:text-primaryDark"
        aria-label="Notifications"
      >
        <Bell className={`${bellStyle ? bellStyle : 'w-[22px] h-[22px]'}`} />
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
                      onDelete={onNotificationDelete}
                    />
                  ))}
                </div>
              )}
            </div>

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
