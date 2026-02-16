import React from "react"
import { motion } from "framer-motion"

import { Phone, Mail, MapPin, Target, Eye } from "lucide-react"
import { CiFacebook } from "react-icons/ci";
import { FaGoogle, FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


export default function ContactUsModule() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const socialVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <section className="bg-transparent sm:px-6 lg:px-8 border-l border-dashed border-dropdownBorder">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-left mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-[30px] font-bold text-white">
            Contact us
          </motion.h2>
          <motion.p variants={itemVariants} className="text-[13px] text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Questions about our fitness equipment? We're here to help!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8 relative"
          >
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-4 p-4 bg-whitesmoke rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <motion.div
                  variants={iconVariants}
                  className="flex-shrink-0 w-[30px] h-[30px] bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Phone className="w-[15px] h-[15px] text-blue-600" />
                </motion.div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Phone</p>
                  <p className="text-[15px] text-gray-900 font-semibold">+91 9074688913</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-4 p-4 bg-whitesmoke rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <motion.div
                  variants={iconVariants}
                  className="flex-shrink-0 w-[30px] h-[30px] bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Mail className="w-[15px] h-[15px] text-green-600" />
                </motion.div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Email</p>
                  <p className="text-[15px] text-gray-900 font-semibold">support@fitlab.com</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-4 p-4 bg-whitesmoke rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <motion.div
                  variants={iconVariants}
                  className="flex-shrink-0 w-[30px] h-[30px] bg-red-100 rounded-full flex items-center justify-center"
                >
                  <MapPin className="w-[15px] h-[15px] text-red-600" />
                </motion.div>
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Address</p>
                  <p className="text-[15px] text-gray-900 font-semibold">Fitlab Hq, Viyyur Jn, Thrissur, Kerala, India (680010)</p>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-300 font-medium mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                {[
                  {
                    name: "Google",
                    Icon: FaGoogle,
                    border: "border-red-500",
                    text: "text-red-500",
                    hover: "hover:bg-red-500 hover:text-white",
                  },
                  {
                    name: "Twitter",
                    Icon: FaXTwitter,
                    border: "border-gray-400",
                    text: "text-gray-400",
                    hover: "hover:bg-gray-800 hover:text-white",
                  },
                  {
                    name: "Instagram",
                    Icon: FaInstagram ,
                    border: "border-pink-500",
                    text: "text-pink-500",
                    hover: "hover:bg-pink-500 hover:text-white",
                  },
                  {
                    name: "Facebook",
                    Icon: FaFacebookF,
                    border: "border-blue-600",
                    text: "text-blue-600",
                    hover: "hover:bg-blue-600 hover:text-white",
                  },
                ].map((social, index) => (
                  <motion.button
                    key={social.name}
                    variants={socialVariants}
                    whileHover="hover"
                    className={`w-12 h-12 border-2 ${social.border} ${social.text} ${social.hover} bg-transparent rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <social.Icon/>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div
                variants={iconVariants}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-[10px]"
              >
                <Target className="w-4 h-4 text-white" />
              </motion.div>
              <h3 className="text-[20px] font-bold mb-[5px]">Mission</h3>
              <p className="text-[12px] text-blue-100 leading-relaxed">
                Empowering fitness enthusiasts with premium equipment, supplements, and expert guidance for exceptional results.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div
                variants={iconVariants}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-[10px]"
              >
                <Eye className="w-4 h-4 text-white" />
              </motion.div>
              <h3 className="text-[20px] font-bold mb-[5px]">Vision</h3>
              <p className="text-[12px] text-purple-100 leading-relaxed">
                To be the India's most trusted fitness destination, inspiring healthier and stronger lives globally.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
