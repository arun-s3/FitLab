import React,{useState} from "react"
import {useNavigate, useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {motion, AnimatePresence} from "framer-motion"

import {LayoutDashboard,Heater as HeatMap, Users, Package, FolderOpen, Ticket, ShoppingCart, Gift, ImageIcon, Headphones, Settings,
  LogOut, Search, ChevronDown, ChevronRight, X} from "lucide-react"

import {adminSignout} from '../../Slices/adminSlice'


export default function AdminSidebar({ isOpen, onClose }){


  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const location = useLocation()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      hasSubmenu: true,
      submenu: [
        { id: "business-overview", label: "Business Overview", path: '/admin/dashboard/business'},
        { id: "operations-overview", label: "Operations Overview", path: '/admin/dashboard/operations' },
      ],
    },
    {
      id: "customer-heatmap",
      label: "Customer Heatmap",
      icon: HeatMap,
      path: '/admin/dashboard/heatmap'
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      path: '/admin/customers'
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      hasSubmenu: true,
      submenu: [
        { id: "add-product", label: "Add Product", path: '/admin/products/add' },
        { id: "list-edit-product", label: "List/Edit Product", path: '/admin/products' },
      ],
    },
    {
      id: "category",
      label: "Category",
      icon: FolderOpen,
      hasSubmenu: true,
      submenu: [
        { id: "add-category", label: "Add Category", path: '/admin/category/add' },
        { id: "list-edit-categories", label: "List/Edit Categories", path: '/admin/category' },
      ],
    },
    {
      id: "coupon-manager",
      label: "Coupon Manager",
      icon: Ticket,
      path: '/admin/coupons' 
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: '/admin/orders'
    },
    {
      id: "offers",
      label: "Offers",
      icon: Gift,
      hasSubmenu: true,
      submenu: [
        { id: "add-offer", label: "Add Offer", path: '/admin/offers/add'},
        { id: "list-edit-offers", label: "List/Edit Offers", path: '/admin/offers' },
      ],
    },
    {
      id: "banners",
      label: "Banners",
      icon: ImageIcon,
    },
    {
      id: "support",
      label: "Support",
      icon: Headphones,
      hasSubmenu: true,
      submenu: [
        { id: "text-chat", label: "Text Chat", path: '/admin/support/text' },
        { id: "video-chat", label: "Video Chat", path: '/admin/support/video' },
      ],
    },
  ]

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
    },
  ]

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const filterMenuItems = (items) => {
    if (!searchTerm) return items

    return items.filter((item) => {
      const matchesMain = item.label.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubmenu = item.submenu?.some((sub) => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesMain || matchesSubmenu
    })
  }

  const filteredMenuItems = filterMenuItems(menuItems)
  const filteredBottomItems = filterMenuItems(bottomMenuItems)

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.8,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  }

  const submenuContainerVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
        opacity: { duration: 0.2 },
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
        opacity: { duration: 0.1 },
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  }

  const submenuItemVariants = {
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    closed: {
      opacity: 0,
      x: -10,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xx-md:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 z-50 xx-md:hidden flex flex-col shadow-2xl border-r border-neutral-700/50"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="mt-[10px] flex items-center justify-between px-[10px] py-[5px] border-b border-dashed border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-full h-[5rem] flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img src="/Images/Logo_main.png" alt="Fitlab" className="h-full w-full"/> 
                </motion.div>
              </div>
              <motion.button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-800/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={22} />
              </motion.button>
            </div>

            <div className="p-6 border-neutral-700/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-800/80 text-white text-[14px] placeholder:text-[13px] placeholder-neutral-400 pl-[15px] pr-4 py-[7px] rounded-[6px] border border-neutral-700/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-[10px] pb-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#200a38]">
              <motion.nav className="px-4 flex flex-col gap-[10px]" variants={containerVariants} initial="closed" animate="open">
                {filteredMenuItems.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <motion.button
                      onClick={() => (item.hasSubmenu ? toggleExpanded(item.id) : null)}
                      className="w-full flex items-center justify-between px-5 py-[5px] text-neutral-300 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/80 hover:to-neutral-700/50 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-neutral-700/30"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4" onClick={()=> {
                        if(!item.hasSubmenu && item?.path){
                            onClose()
                            navigate(item.path, {
                              state: { from: location.pathname }
                            }) 
                        }
                      }}>
                        <motion.div
                          className="p-2 rounded-lg bg-neutral-800/50 group-hover:bg-orange-400/20 transition-all duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <item.icon size={17} className="text-primary group-hover:text-orange-300 transition-colors duration-300" />
                        </motion.div>
                        <span className="font-semibold text-[15px]">{item.label}</span>
                      </div>
                      {item.hasSubmenu && (
                        <motion.div
                          animate={{ rotate: expandedItems[item.id] ? 180 : 0 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                          className="p-1 rounded-full group-hover:bg-neutral-700/50 transition-colors duration-300"
                        >
                          <ChevronDown size={18} className="text-secondary"/>
                        </motion.div>
                      )}
                    </motion.button>

                    {item.hasSubmenu && (
                      <AnimatePresence>
                        {expandedItems[item.id] && (
                          <motion.div
                            variants={submenuContainerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="overflow-hidden"
                          >
                            <motion.div
                              className="ml-6 mt-3 space-y-2 pl-6 border-l-2 border-neutral-700/30"
                              variants={submenuContainerVariants}
                            >
                              {item.submenu.map((subItem, subIndex) => (
                                <motion.button
                                  key={subItem.id}
                                  variants={submenuItemVariants}
                                  className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/60 hover:to-neutral-700/30 rounded-lg transition-all duration-300 text-left group border border-transparent hover:border-neutral-700/20"
                                  whileHover={{ scale: 1.02, x: 6 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={()=> {
                                     if(subItem?.path){
                                        onClose()
                                        navigate(subItem.path, {
                                          state: { from: location.pathname }
                                        }) 
                                     }
                                  }}
                                >
                                  <motion.div
                                    className="p-1 rounded-md bg-neutral-800/30 group-hover:bg-orange-500/10 transition-colors duration-300"
                                    whileHover={{ rotate: 90 }}
                                  >
                                    <ChevronRight
                                      size={14}
                                      className="group-hover:text-orange-300 transition-colors duration-300"
                                    />
                                  </motion.div>
                                  <span className="text-sm font-medium">{subItem.label}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                ))}
              </motion.nav>
            </div>

            <div className="border-t border-[#420d67] px-4 py-[10px] bg-gradient-to-r from-neutral-800/30 to-neutral-900/30 backdrop-blur-sm">
              <motion.nav className="space-y-1" variants={containerVariants} initial="closed" animate="open">
                {filteredBottomItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    className="w-full flex items-center space-x-4 px-5 text-neutral-300 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/80 hover:to-neutral-700/50 rounded-xl transition-all duration-300 group border border-transparent hover:border-neutral-700/30"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={()=> {
                         if(item.id === 'logout'){
                             dispatch(adminSignout())
                             onClose()
                         } 
                    }}
                  >
                    <motion.div
                      className="p-2 rounded-lg bg-neutral-800/50 group-hover:bg-orange-400/20 transition-all duration-300"
                      whileHover={{ rotate: item.id === "logout" ? 180 : 5 }}
                    >
                      <item.icon size={19} className="group-hover:text-orange-400 transition-colors duration-300" />
                    </motion.div>
                    <span className="font-semibold text-[15px] tracking-[0.5px]">{item.label}</span>
                  </motion.button>
                ))}
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

