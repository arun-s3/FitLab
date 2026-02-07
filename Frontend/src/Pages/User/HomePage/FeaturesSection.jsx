import React, { useState } from "react"
import { motion } from "framer-motion"

import {Cpu, Clock, Activity, Zap, Dumbbell, Heart, BarChart3, CreditCard, Tag, Truck, Users, MessageCircle} from "lucide-react"

const features = [
  {
    id: 11,
    icon: Cpu,
    image: "/Images/AboutUs/coachPlus.png",
    title: "Coach+ Personal Fitness Companion",
    description:
      "A smart training partner built around your goals. Coach+ delivers personalized workout guidance, progress-based insights, and contextual recommendations.",
    color: "from-rose-400 to-red-400",
  },
  {
    id: 8,
    icon: Clock,
    image: "/Images/AboutUs/fitnessTrackerEngine.png",
    title: "Workout Tracking & Training Engine",
    description:
      "Train with structure and clarity. Build reusable workout templates, track sessions with timers, and monitor performance over time.",
    color: "from-lime-400 to-green-400",
  },
  {
    id: 9,
    icon: Activity,
    image: "/Images/AboutUs/healthProfile.png",
    title: "Comprehensive Health Profile",
    description:
      "Your fitness data, fully organized. Track key health metrics like height, weight, blood pressure, BMI, body composition, etc.",
    color: "from-yellow-400 to-amber-400",
  },
  {
    id: 1,
    icon: Zap,
    image: "/Images/AboutUs/smartFitnessCommerce.png",
    title: "Smart Fitness Marketplace",
    description:
      "Discover strength, cardio, accessories, and supplements through intelligently structured and deeply nested categories.",
    color: "from-amber-400 to-orange-400",
  },
  {
    id: 2,
    icon: Dumbbell,
    image: "/Images/AboutUs/exerciseDrivenShopping.png",
    title: "Exercise-Based Product Discovery",
    description:
      "Shop the way you train. Explore equipment by exercise type, body part, difficulty level, and movement variations.",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    icon: Heart,
    image: "/Images/AboutUs/wishlistMgmt.png",
    title: "Smart Wishlist Planning",
    description:
      "Organize fitness goals visually. Create multiple wishlists, customize thumbnails, set priorities for lists and products, and share plans effortlessly.",
    color: "from-red-400 to-pink-400",
  },
  {
    id: 10,
    icon: BarChart3,
    image: "/Images/AboutUs/aiInisghts.png",
    title: "Insights & Performance Dashboards",
    description:
      "Turn activity and usage data into clarity. Interactive dashboards reveal trends, progress patterns, and actionable insights.",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 4,
    icon: CreditCard,
    image: "/Images/AboutUs/walletAndPayments.png",
    title: "Unified Wallet & Payments",
    description:
      "One wallet, complete flexibility. Pay seamlessly using Razorpay, Stripe, or PayPal with smart auto-recharge support.",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 6,
    icon: Tag,
    image: "/Images/AboutUs/smartCouponsOffersEngine.png",
    title: "Automatic Coupons & Best Deals",
    description:
      "Never miss savings. Available coupons and offers are intelligently evaluated to apply the best deal at checkout.",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 7,
    icon: Truck,
    image: "/Images/AboutUs/flexibleCheckout.png",
    title: "Flexible Checkout & Order Tracking",
    description:
      "Choose how you pay and track every order. Supports Cash on Delivery with real-time delivery updates and visibility.",
    color: "from-sky-400 to-blue-400",
  },
  {
    id: 5,
    icon: Users,
    image: "/Images/AboutUs/peerFitnessEconomy.png",
    title: "Peer-Powered Fitness Economy",
    description:
      "A trust-driven ecosystem. Enable lending, borrowing, and financial support between users directly within FitLab.",
    color: "from-purple-400 to-violet-400",
  },
  {
    id: 12,
    icon: MessageCircle,
    image: "/Images/AboutUs/supportChat.png",
    title: "Instant Chat & Video Support",
    description:
      "Help without delays. Connect instantly through chat or video for real-time assistance whenever you need it.",
    color: "from-teal-400 to-cyan-400",
  },
]

export default function FeaturesSection() {

  const [hoveredId, setHoveredId] = useState(null)

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
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const hoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    },
  }

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            Built Different. Built for Fitness. Everything You Need
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An end-to-end fitness platform combining training, tracking, commerce, and smart experiences in one ecosystem.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon

            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover="hover"
                className="group relative bg-white rounded-xl p-3 sm:p-4 border border-slate-200 cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.05 }}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} mb-2`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </motion.div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed mb-3">{feature.description}</p>

                  <motion.button
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={feature.learnMoreLink}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-300"
                  >
                    Learn more
                    <motion.span animate={{ x: hoveredId === feature.id ? 4 : 0 }} transition={{ duration: 0.3 }}>
                      →
                    </motion.span>
                  </motion.button>
                </div>

                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  style={{
                    mask: "linear-gradient(to bottom, black 0%, transparent 100%)",
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
