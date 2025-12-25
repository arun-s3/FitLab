import React from "react"
import { motion } from "framer-motion"

import {Dumbbell, Brain, Users, ShieldCheck, Rocket} from "lucide-react"


export default function CoreValues() {

    const coreValuesArr = [
      {
        icon: Dumbbell,
        title: "Performance-Driven Fitness",
        description:
          "Every feature, product, and recommendation is built to improve training quality, efficiency, and measurable results.",
      },
      {
        icon: Brain,
        title: "Intelligent Personalization",
        description:
          "We leverage data, insights, and AI to deliver personalized workouts, shopping, and coaching experiences for every user.",
      },
      {
        icon: Users,
        title: "Connected Community",
        description:
          "FitLab thrives on collaboration—connecting users, coaches, and support teams through shared goals and real-time interaction.",
      },
      {
        icon: ShieldCheck,
        title: "Trust & Reliability",
        description:
          "Secure payments, transparent transactions, and dependable systems form the foundation of our platform.",
      },
      {
        icon: Rocket,
        title: "Continuous Innovation",
        description:
          "We constantly evolve our platform with smarter features, deeper insights, and better experiences as fitness and technology advance.",
      }
    ]

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3,
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      },
    }


    return (
      <div className="w-full bg-white text-gray-900">
        
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-[5px] text-gray-900">
                Our Core Values
              </motion.h2>
              <motion.p variants={itemVariants} className="text-[17px] text-gray-600 max-w-2xl mx-auto">
                These principles guide every decision we make
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {coreValuesArr.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className={`bg-white p-8 rounded-xl transition-all duration-300 ${index === 3 && 'col-span-2'}`}
                >
                  <motion.div
                    className="inline-block p-3 bg-orange-100 rounded-lg mb-4"
                  >
                    <value.icon size={32} className="text-orange-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
    </div>
    )
}
