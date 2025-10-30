import React, {useState, useEffect, useRef, useContext} from "react"
import {useOutletContext} from 'react-router-dom'
import {motion, AnimatePresence} from "framer-motion"
import {debounce} from 'lodash'

import {Users, Send, Search, Clock, User, Headphones, Circle, MessageSquare, Settings, Bell} from "lucide-react"
import axios from 'axios'

import {AdminSocketContext} from '../../../Components/AdminSocketProvider/AdminSocketProvider'
import AdminTitleSection from '../../../Components/AdminTitleSection/AdminTitleSection'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'


export default function AdminTextChatSupportPage() {

  const [totalUsers, setTotalUsers] = useState(null)
  const [usernameList, setUsernameList] = useState({searched: false, list: []})

  const [selectedUser, setSelectedUser] = useState(null)
  const selectedUserRef = useRef(null)

  const [initialActiveUser, setInitialActiveUser] = useState({})

  const [textOrReply, setTextOrReply] = useState('Text')
  const [lastSeen, setLastSeen] = useState('')

  const {setPageBgUrl} = useOutletContext() 
  setPageBgUrl(`linear-gradient(to right,rgba(255,255,255,0.93),rgba(255,255,255,0.93)), url('/admin-bg8.png')`)

  const adminName = "Support Agent"

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  const {
      isConnected,
      socket,
      guestCount,
      activeUsers,
      messages, 
      newMessage, 
      typingUsers, 
      unreadCounts,
      setUnreadCounts, 
      notifications,
      setNotifications,
      messagesEndRef, 
      handleTyping,
      handleSendMessage
  } = useContext(AdminSocketContext)

  const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['searchResultDropdown'])

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setLastSeen(user.lastSeen)

    console.log("Clearing notifications....")
    const notificationForUserExists = notifications.length > 0 && notifications.some(statusObj=> statusObj.sender === user.username)
    if(notificationForUserExists){
      setNotifications(notifications=> {
      notifications.map(statusObj=> {
        if(statusObj.sender === user.username){
          statusObj.msgCount = 0
        }
        return statusObj
      })
      return notifications
    })
    }
  }

  useEffect(()=> {
    async function fetchTotalUserCount(){
      const response = await axios.get(`${baseApiUrl}/totalUsers`, {withCredentials: true})
      setTotalUsers(response.data.totalUsers)
    }
    if(!totalUsers){
      fetchTotalUserCount()
    }
  },[])

  useEffect(()=> {
    if(socket){
      // socket.on("updated-activeUsers", (updater) => {
      //   console.log("Inside updated-activeUsers")
      //   setActiveUsers(updater.users)
      //   handleUserSelect(updater.user)
      // })
      socket.on("receive-message", (message) => {
        const selected = selectedUserRef.current
        console.log(`Now message.sender is ${message.sender} and selectedUser.username is ${selected?.username}`)
        if(message.sender !== adminName && ( !selected || message.sender !== selected.username)){
          console.log("Setting notification....")
          setNotifications(notifications=> {
            const userExists = notifications.some(statusObj=> statusObj.sender === message.sender)
            if(userExists){
              return notifications.map(statusObj=> {
                if(statusObj.sender === message.sender){
                  return { ...statusObj, msgCount: statusObj.msgCount + 1 }
                }
                return statusObj
              })
            }else{
              return [...notifications, {sender: message.sender, msgCount: 1}]
            }
          })
        } 
      })
      socket.on('reconnect-if-user-selected', (user)=> {
        if(selectedUser.username === user.username){
          handleUserSelect(user)
        }
      })
      socket.on('update-last-seen', (user)=> {
        console.log("Inside update-last-seen")
        console.log("selectedUser--->", selectedUser)
        if(selectedUser && selectedUser.username === user.username){
          setLastSeen(user.lastSeen)
        }
      })
    }
  },[socket])

  useEffect(()=> {
    selectedUserRef.current = selectedUser
  }, [selectedUser])

  useEffect(()=> {
    scrollToBottom()

    console.log("Messages--->", messages)
    if(selectedUser && messages?.[selectedUser.username]?.length > 0){
      console.log("messages[messages.length - 1]---->", messages[selectedUser.username][messages.length - 1])
      const lastMsg = messages[selectedUser.username][messages[selectedUser.username].length - 1]
      const isLastMsgByAdmin = lastMsg.isAdmin
      if(!isLastMsgByAdmin){
        setTextOrReply('Reply')
      }else setTextOrReply('Text')
    }
  }, [messages, selectedUser])

  useEffect(()=> {
    console.log("typingUsers--->", typingUsers)
    if(selectedUser){
      console.log("selectedUser.username--->", selectedUser.username)
      setLastSeen(selectedUser.lastSeen)
    }
    if(notifications){
      console.log("notifications--->", notifications)
    }
  },[typingUsers, selectedUser, activeUsers, notifications])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchUsernameList = (searchTerm)=> {
    async function fetchUsernames(){
      const response = await axios.get(`${baseApiUrl}/search/${searchTerm}`, {withCredentials: true})
      console.log("response from fetchUserId--->", response)
      const usernames = response.data.usernames
      if(usernames.length > 0){
        toggleDropdown('searchResultDropdown')
        setUsernameList({searched: true, list: usernames})
      }else{
        toggleDropdown('searchResultDropdown')
        setUsernameList({searched: true, list: []})
      }    
    } 
    fetchUsernames({searched: false, list: []})
  }

  const debouncedUsernameSearch = useRef(
      debounce((searchTerm)=> {
        fetchUsernameList(searchTerm)
      }, 100) 
  ).current; 

  const searchUsernames = (e)=> {
    console.log("Inside searchUsernames")
    const searchTerm = e.target.value
    console.log('searchTerm--->', searchTerm)
    if(searchTerm.trim() !== ''){
        console.log("Getting searched usernames--")
        debouncedUsernameSearch(searchTerm)
    } 
    else{
      setUsernameList({searched: false})
    } 
  }

  const selectSearchedUser = (username)=> {
    console.log("Insdie selectSearchedUser...")
    const user = activeUsers.find(user=> user.username === username && user.isOnline)
    if(user){
      setInitialActiveUser(user)
      handleUserSelect(user)
      // if(socket){
      //   socket.emit("update-and-sort-activeUsers", user)
      // }
    }else{
      // sendOfflineMessage(username)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatLastSeen = (timestamp) => {
    const now = new Date()
    const lastSeen = new Date(timestamp)
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }
  

  return (
    <section id='AdminTextChatSupportPage'>
    
        <header>

            <AdminTitleSection heading='Text Chat Support' subHeading="Manage and respond to customer inquiries in real-time through text chat for user satisfaction."/>

        </header>

        <main className="mr-4 p-4 border border-primaryDark rounded-[7px]">

            <div className="h-screen bg-gray-100 flex">
      <div className={`${guestCount > 0 ? 'w-[22rem]' : 'w-80'} p-[7px] bg-white border border-dropdownBorder 
        rounded-[5px] flex flex-col`}>
        <div className="p-4 border-b border-gray-200 bg-purple-500 text-white rounded-[3px]"> {/*rgb(187, 103, 245) */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold"> Admin Chat </h1>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />
              <span className="text-xs">{isConnected ? "Online" : "Offline"}</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondaryLight2" size={16} />
            <input
              type="text"
              placeholder="Search users by usernames..."
              onChange={(e)=> searchUsernames(e)}
              ref={dropdownRefs.searchResultDropdown}
              className="w-full h-8 pl-10 pr-4 py-2 bg-white text-secondary text-[13px] placeholder-secondaryLight2 
                placeholder:text-[12px] rounded-lg border border-dropdownBorder focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {
              usernameList && usernameList?.searched && openDropdowns.searchResultDropdown &&
              <motion.div className="absolute w-full py-[7px] px-[10px] bg-whitesmoke flex flex-col gap-[10px] border
               border-dropdownBorder rounded-[4px] z-10"
                initial={{y: -50, opacity: 0, scale: 0.5}}
                animate={{y: 0, opacity: 1, scale: 1}}
                exit={{y: -50, opacity: 0, scale: 0.5}}>
                { usernameList.list.length > 0 ? 
                  usernameList.list.map(username=> (
                    <span className="w-full px-[5px] text-[12px] text-muted flex items-center gap-[5px] hover:bg-primaryDark
                     hover:text-secondary rounded-[4px] cursor-pointer" onClick={()=> selectSearchedUser(username)}>
                       {
                        (
                          ()=>{
                            const isOnline = activeUsers.find(user=> user.username === username && user.isOnline)
                            return(
                              <motion.div
                                className={`w-[5px] h-[5px] rounded-full ${isOnline ? "bg-green-500" : "bg-red-500 scale-110"}`}
                                animate={isOnline && { scale: [1, 1.2], opacity: [0.5, 1]}}
                                transition={isOnline && { duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                              />
                            )
                          }
                        )()
                       }
                       <span> {username}  </span>
                    </span>
                  ))
                  : <p className="h-[2rem] flex justify-center items-center text-muted text-[14px] tracking-[0.3px]">
                     No such users found! 
                    </p>
                }
              </motion.div>
            }
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className={`${guestCount > 0 ? 'flex items-center justify-between gap-4' : 'grid grid-cols-2 gap-4'}`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{totalUsers ? totalUsers : '--'}</div>
              <div className="text-xs text-gray-600"> Total FitLab Users </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeUsers.filter((user) => user.isOnline && !user.username.startsWith('guest')).length}
              </div>
              <div className="text-xs text-gray-600"> Online Users </div>
            </div>
            {
              guestCount > 0 &&
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600"> {guestCount} </div>
                <div className="text-xs text-gray-600"> Online Guests </div>
              </div>
            }
          </div>
        </div>
        

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {
              [...activeUsers].sort((a, b) => {
                  if (!initialActiveUser) return 0;
                  if (a.userId === initialActiveUser.userId) return -1;
                  if (b.userId === initialActiveUser.userId) return 1;
                  return 0;
                })
                .map((user) => (
                  <motion.div
                    key={user.socketId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedUser?.socketId === user.socketId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-full flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                          </div>
                          <Circle
                            size={12}
                            className={`absolute -bottom-1 -right-1 ${
                              user.isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="font-medium text-gray-900 truncate flex items-center gap-[5px]">
                            <span> {user.username} </span>
                            <span className="text-[11px] text-green-500 italic">
                               {(user.username).startsWith('guest') ? '(Guest)' : null} 
                            </span>
                          </div>
                          <div className="w-full text-xs text-gray-500 flex items-center justify-between">
                            {
                              user.isOnline ?  "Online" 
                              : <span className="flex items-center gap-[5px]">
                                  <Clock size={12} className="mr-1" /> 
                                  <span> {formatLastSeen(user.lastSeen)} </span>
                                </span>
                            }
                            {
                              user.isOnline && selectedUser && typingUsers[selectedUser?.username] &&
                              (
                                <motion.div className="flex items-center gap-[5px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                  <span className="text-xs text-green-500"> typing </span>
                                  <motion.div
                                    className="flex space-x-1 mt-[2px]"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                  >
                                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                  </motion.div>
                                </motion.div>
                              )
                            }
                            { notifications &&
                              notifications.length > 0 && notifications.some(status=> status.sender === user.username) && (
                                notifications.find(status=> status.sender === user.username).msgCount > 0 &&
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                  { notifications.find(status=> status.sender === user.username).msgCount }
                               </motion.div>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
            ))}
          </AnimatePresence>

          {activeUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No active users found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <Circle
                      size={12}
                      className={`absolute -bottom-1 -right-1 ${
                        selectedUser.isOnline ? "text-green-500 fill-green-500" : "text-gray-400 fill-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.username}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.isOnline ? "Online" : `Last seen ${formatLastSeen(lastSeen)}`}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={20} className="text-gray-600" />
                  </button>
                </div> */}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {(messages[selectedUser.username] || []).map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isAdmin ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      {message.isAdmin ? <Headphones size={12} /> : <User size={12} />}
                      <span className="text-xs opacity-75">{message.sender}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-[10px] opacity-75 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </motion.div>
              ))}

              {typingUsers[selectedUser.username] && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span className="text-xs opacity-75">{selectedUser.username} is typing</span>
                      <motion.div
                        className="flex space-x-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e)=> handleSendMessage(e, selectedUser)} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e)=> handleTyping(e, selectedUser)}
                  placeholder={` ${textOrReply === 'Text' ?
                               `Type a message for ${selectedUser.username}...` : `Reply to ${selectedUser.username}...`} `}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isConnected}
                />
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                  <span>Send</span>
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>

        </main>

    </section>
  )
}
