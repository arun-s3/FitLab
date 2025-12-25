import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { motion } from "framer-motion"

import {Zap, Dumbbell, Heart, CreditCard, Users, Tag, Truck, Clock, Activity, BarChart3, Cpu, MessageCircle} from "lucide-react"

import CoachPlus from '../Coach+/Coach+'


export default function  FeaturesSection() {

  const [openCoach, setopenCoach] = useState(false)

  const navigate = useNavigate()

  const features = [
    {
      id: 1,
      icon: Zap,
      image: "/AboutUs/smartFitnessCommerce.png",
      title: "Smart Fitness Commerce",
      description:
        "Strength, cardio, accessories, and supplements — intelligently organized. Browse deeply nested product categories designed for both beginners and advanced athletes.",
      color: "from-amber-400 to-orange-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/', { state: { scrollTo: "shopByCategories" }}), 500)
    },
    {
      id: 2,
      icon: Dumbbell,
      image: "/AboutUs/exerciseDrivenShopping.png",
      title: "Exercise-Driven Shopping",
      description:
        "Shop equipment based on how you train, not just what you buy. Users can explore exercises by body part, equipment, difficulty, and variants.",
      color: "from-blue-400 to-cyan-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/shop'), 500)
    },
    {
      id: 3,
      icon: Heart,
      image: "/AboutUs/wishlistMgmt.png",
      title: "Advanced Wishlist Management",
      description:
        "Create multiple wishlists with custom thumbnails, set priorities for both lists and individual products, and easily edit, organize, and share them with others to plan fitness goals smarter.",
      color: "from-red-400 to-pink-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/wishlist'), 500)
    },
    {
      id: 4,
      icon: CreditCard,
      image: "/AboutUs/walletAndPayments.png",
      title: "Intelligent Wallet & Payments",
      description:
        "One wallet. Multiple gateways. Zero friction. Supports Razorpay, Stripe, and PayPal with smart auto-recharge capabilities.",
      color: "from-green-400 to-emerald-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/wallet'), 500)
    },
    {
      id: 5,
      icon: Users,
      image: "/AboutUs/peerFitnessEconomy.png",
      title: "Peer-to-Peer Fitness Economy",
      description:
        "Borrow, lend, and support — powered by trust. FitLab enables users to give loans and receive funds within the platform.",
      color: "from-purple-400 to-violet-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/wallet'), 500)
    },
    {
      id: 6, 
      icon: Tag,
      image: "/AboutUs/smartCouponsOffersEngine.jpg",
      title: "Smart Coupons & Offers Engine",
      description:
        "Always get the best deal — automatically. Multiple coupons and offers are intelligently evaluated at checkout.",
      color: "from-orange-400 to-red-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/coupons'), 500)
    },
    {
      id: 7, 
      icon: Truck,
      image: "/AboutUs/flexibleCheckout.png",
      title: "Flexible Checkout & Delivery Tracking",
      description:
        "Pay your way. Track every step. Supports Cash on Delivery, real-time order tracking, and transparent logistics visibility.",
      color: "from-sky-400 to-blue-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/orders'), 500)
    },
    {
      id: 8,
      icon: Clock,
      image: "/AboutUs/fitnessTrackerEngine.png",
      title: "Fitness Tracker & Workout Engine",
      description:
        "Train smarter with structure and precision. Create reusable exercise templates, track workouts with timers, and monitor progression.",
      color: "from-lime-400 to-green-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/fitness/tracker'), 500)
    },
    {
      id: 9, 
      icon: Activity,
      image: "/AboutUs/healthProfile.png",
      title: "Advanced Health Profile Tracking",
      description:
        "Your body, fully quantified. Track comprehensive health metrics including height, weight, blood pressure, and body fat.",
      color: "from-yellow-400 to-amber-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/fitness/tracker', {state: { goTo: "bmi" }}), 500)
    },
    {
      id: 10,
      icon: BarChart3, 
      image: "/AboutUs/aiInisghts.png",
      title: "AI-Powered Dashboards & Insights",
      description:
        "Turn raw fitness and business data into clarity. Interactive dashboards and AI-generated insights help you understand trends and opportunities.",
      color: "from-indigo-400 to-purple-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/fitness/tracker', {state: { goTo: "dashboard" }}), 500)
    },
    {
      id: 11,
      icon: Cpu, 
      image: "/AboutUs/coachPlus.png",
      title: "Coach+ — Your Personalized AI Fitness Companion",
      description:
        "Not just a bot — a training partner. Coach+ provides personalized fitness guidance, workout insights, and contextual recommendations.",
      color: "from-rose-400 to-red-400",
      learnMoreLink: ()=> setopenCoach(true)
    },
    {
      id: 12,
      icon: MessageCircle,
      image: "/AboutUs/supportChat.png",
      title: "Real-Time Support via Chat & Video",
      description: "Human help, when you need it. Instant chat and video support ensure users are never stuck.",
      color: "from-teal-400 to-cyan-400",
      learnMoreLink: ()=> setTimeout(()=> navigate('/support'), 500)
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-[5px]">
            What Sets  <span className="text-orange-500">FitLab Apart</span>
          </h2>
          <p className="text-[17px] text-gray-600 max-w-2xl mx-auto">
            FitLab brings together commerce, community, and coaching in one unified platform
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 flex-shrink-0`}
                    >
                      <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed mb-4">{feature.description}</p>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 text-orange-500 font-semibold text-sm cursor-pointer"
                      onClick={()=> feature?.learnMoreLink()}
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="hidden md:flex items-center justify-center flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          className={`w-full h-full object-cover ${feature.id === 2 && 'object-[left_-25px_top_0rem]'}`}
                          src={feature.image}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {
          openCoach &&
              <div className="fixed bottom-[2rem] left-[2rem] z-50">
              
                  <CoachPlus closeable={true} 
                      autoOpen={true}
                      onCloseChat={()=> setopenCoach(false)}
                  />
              </div>
      }

    </section>
  )
}

