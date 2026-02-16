import React, {useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {motion} from "framer-motion"

import {ShoppingCart, Heart, User, MapPin, MapPinPlus, CreditCard, TicketPercent, ShoppingBag, ArrowRight} from "lucide-react"


export default function AuthPrompt(){

  const location = useLocation()
  const navigate = useNavigate()

  const [config, setConfig] = useState(null)

  const getPageConfig = (pageName)=> {
    const configs = {
      cart: {
        icon: ShoppingCart,
        title: "Your Personalized Cart",
        description: "Save your favorite items and checkout seamlessly",
      },
      wishlist: {
        icon: Heart,
        title: "Create Your Wishlist",
        description: "Save items you love and never lose track of them",
      },
      account: {
        icon: User,
        title: "Manage Your Profile",
        description: "Update your preferences and account settings",
      },
      account_addresses: {
        icon: MapPin,
        title: "Manage Your Addresses",
        description: "Easily view, edit, delete, or set default addresses",
      },
      account_addresses_add: {
        icon: MapPinPlus,
        title: "Add New Address",
        description: "Easily add new address",
      },
      shop_product: {
        icon: ShoppingBag,
        title: "Discover Products",
        description: "Explore detailed product features, reviews, offers and buy instantly",
      },
      wallet: {
        icon: CreditCard,
        title: "Your Digital Wallet",
        description: "Securely store funds, track transactions, and make payments",
      },
      coupons: {
        icon: TicketPercent,
        title: "Exclusive Coupons",
        description: "View, apply, and manage discount coupons to save more on your purchases"
      }
    }
    return configs[pageName] || configs.cart
  }
  
    useEffect(() => {
      if (location) {
        let currentPage = location.pathname.slice(1) 

        if (currentPage.includes("/")) {
          currentPage = currentPage.replace(/\//g, "_")
        }

        const configuration = getPageConfig(currentPage)
        setConfig(configuration)
      }
    }, [location])

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  }

  const iconVariants = {
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  const handleSignIn = () => {
        navigate('/signin', {replace: true, state: {currentPath: location.pathname}})
        onClose()
  }

  const handleSignUp = () => {
      navigate('/signup', {replace: true, state: {currentPath: location.pathname}})
      onClose()
  } 


  return (

    <>
        { 
          config && 
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-[31rem] bg-white rounded-2xl shadow-lg border border-dropdownBorder overflow-hidden"
            >
              <div className="bg-purple-50 px-[8px] py-[12px] text-center">
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
                  className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md mb-4"
                >
                  <motion.div variants={iconVariants}>
                    <config.icon className="w-[25px] h-[25px] text-secondary" />
                  </motion.div>
                </motion.div>

                <motion.h2 variants={itemVariants} className="text-[18px] font-bold tracking-[0.4px] text-gray-900">
                  {config.title}
                </motion.h2>

                <motion.p variants={itemVariants} className="text-gray-600 text-[13px] leading-relaxed">
                  {config.description}
                </motion.p>
              </div>

              <div className="px-6 py-4">
                <motion.p variants={itemVariants} className="text-gray-700 text-center mb-6 text-[13px] whitespace-nowrap">
                  Join thousands of happy customers and unlock all features
                </motion.p>

                <div className="space-y-3">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleSignUp}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[15px] font-semibold tracking-[0.4px]
                      py-3 px-4 rounded-[7px] transition-colors duration-200 flex items-center justify-center group"
                  >
                    <span>Create Account</span>
                    <motion.div className="ml-2" animate={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleSignIn}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-[15px] font-semibold tracking-[0.4px] 
                      py-3 px-4 rounded-[7px] transition-colors duration-200"
                  >
                    Already have an account? Sign In
                  </motion.button>
                </div>

                {/* <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span>Free to join</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span>Order tracking</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span>Exclusive deals</span>
                    </div>
                  </div>
                </motion.div> */}
              </div>
            </motion.div>
        }
    </>
  )
}

