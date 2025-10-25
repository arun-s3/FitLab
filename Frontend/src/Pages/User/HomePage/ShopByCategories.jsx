import React from 'react'
import {useNavigate} from 'react-router-dom'
import { motion } from "framer-motion"

import { ArrowRight } from "lucide-react"


const categories = [
  {
    id: 1,
    title: "Strength",
    description:
      `Building muscle requires strength and power. Free weights and other weight equipment are crucial. 
       They assist you gain muscle mass and strength by providing resistance exercise. 
       Exercising with weights improves your range of motion while also increasing your balance and stability.`,
    image: "./StrengthCategoryPic.png"
  },
  {
    id: 2,
    title: "Cardio",
    description:
      `Cardio exercises are a great way to lose weight. 
      They can be used in the comfort of your own home, and they allow you to customize your workout to suit your needs. 
      These exercise helps spend up on your metabolism and burning calories more quickly.`,
    image: "./CardioCategoryPic.png"
  },
  {
    id: 3,
    title: "Supplements",
    description:
      `Muscle-building supplements can improve physical performance during resistance training and help stimulate muscle growth. 
      To maximize muscle growth and development, a process known as muscle hypertrophy, 
      it's important to maintain a balanced diet and an exercise routine featuring resistance training.`,
    image: "./SupplementsCategoryPic.png"
  },
  {
    id: 4,
    title: "Accessories",
    description:
      `By having your workout gear right, you'll be set for a productive, safe and effective workout. 
      Improve your performance and comfort with the right accessories. Invest time to research workout gear and equipment. 
      Before making a purchase, take time to research workout gear to find the best for your goals and specific needs.`,
    image: "./AccessoriesCategoryPic.png.png"
  },
]

const CategoryCard = ({ category, index }) => {

  const isEven = index % 2 === 0
  const isBlackBg = index === 1 || index === 3

  const navigate = useNavigate()

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      className={` h-auto md:h-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 
        flex flex-col md:flex-row ${ !isEven ? "md:flex-row-reverse" : ""} ${isBlackBg ? "bg-black" : "bg-white"}`}
    >
      <motion.div 
        variants={imageVariants} 
        className={`w-full md:w-2/5
          ${category.title === 'Supplements' ? 'h-48 md:h-[335px] -mt-[28px]' : 'h-48 md:h-[300px]'} flex-shrink-0 overflow-hidden
          ${ !isEven && "mt-0 md:mt-[7px] mr-[8px]"} 
           h-52 sm:h-60
        `}
     >
        <img 
            src={category.image || "/placeholder.svg"} 
            alt={category.title} 
            className={`w-full object-cover ${ !isEven ? "h-[95%] rounded-tr-[8px] rounded-br-[8px]" : "h-full"} `} />
      </motion.div>

      <motion.div
        variants={contentVariants}
        className={`w-full p-6 md:p-8 self-center space-y-4 flex flex-col justify-center ${
          isBlackBg ? "text-white" : "text-black"
        }`}
      >
        <h3 className="text-2xl md:text-[25px] font-bold">{category.title}</h3>
        <p className={`text-sm leading-relaxed ${isBlackBg ? "text-gray-300" : "text-gray-600"}`}>
          {category.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ease: 'easeIn', duration: 0.1}}
          onClick={()=> navigate('/shop', {state: {category: category.title.toLowerCase()}})}
          className={`border-2 font-semibold px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 w-fit ${
            isBlackBg
              ? "border-primary text-primary hover:bg-yellow-300 hover:border-yellow-300 hover:text-black"
              : "border-secondary text-secondary hover:bg-purple-800 hover:border-purple-800 hover:text-white"
          }`}
        >
          Explore
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function ShopByCategories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="w-full bg-gray-100 py-16 md:py-10 px-4 md:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={headerVariants} className="text-center mb-12 md:mb-8">
          <h2 className="text-[26px] xs-sm2:text-[28px] xs-sm:text-[30px] font-bold text-black mb-[5px]">Shop By Categories</h2>
          <p className="text-gray-600 text-sm md:text-base">Pick a category you need to explore the products</p>
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
