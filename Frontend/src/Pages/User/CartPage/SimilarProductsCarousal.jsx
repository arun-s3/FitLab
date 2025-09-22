import React, {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

import {Star, ChevronLeft, ChevronRight} from 'lucide-react'


export default function SimilarProductsCarousal(){

    const [currentProductIndex, setCurrentProductIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const similarProducts = [
        {
          id: 1,
          name: "Chest Biceps Curler BMW-006",
          price: "Rs 85,500",
          image: "/chestBicepsCurl.jpg",
          rating: 5,
          discount: "-20%"
        },
        {
          id: 2,
          name: "PowerKettle Pro 30kg",
          price: "Rs 9,799",
          image: "/PowerkettlePro.jpg",
          rating: 5
        },
        {
          id: 3,
          name: "45 Degree Leg Press AF-S6P03",
          price: "Rs 83,900",
          image: "/45-Degree-leg-press.jpg",
          rating: 5,
          discount: "-20%"
        },
        {
          id: 4,
          name: "CE 300G Lateral Raise",
          price: "Rs 87,000",
          image: "/lateral-raise.jpg",
          rating: 5
        }
      ]

      const containerVariants = {
        enter: (direction) => ({
          x: direction > 0 ? 100 : -100,
          opacity: 0,
        }),
        center: { x: 0, opacity: 1, transition: { duration: 0.1, ease: "easeOut" } },
        exit: (direction) => ({
          x: direction > 0 ? -100 : 100,
          opacity: 0,
          transition: { duration: 0.1, ease: "easeIn" },
        }),
      }

      const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: (i) => ({
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 18 },
        }),
        rest: { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
        hover: {
          scale: 1.03,
          y: -5,
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
      }

      const hoverVariants = {
        rest: { scale: 1, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
        hover: {
          scale: 1.03,
          y: -5,
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
      }

      const buttonVariants = {
        rest: { scale: 1 },
        hover: {
          scale: 1.15,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          transition: { type: "spring", stiffness: 400, damping: 20 },
        },
        tap: { scale: 0.95 },
      }
    
      const handlePrevProduct = ()=> {
        setDirection(1)
        setCurrentProductIndex((prevIndex) => 
          prevIndex === 0 ? similarProducts.length - 1 : prevIndex - 1
        )
      }
    
      const handleNextProduct = ()=> {
        setDirection(-1)
        setCurrentProductIndex((prevIndex) => 
          prevIndex === similarProducts.length - 1 ? 0 : prevIndex + 1
        )
      }
    


    return(
      <div className="mt-[2rem] mx-[3rem]">
        <h2 className="text-[1.5rem] text-secondary font-bold mb-[2rem]">
          Similar Products
        </h2>

        <div className="relative h-[auto] min-h-[400px] cursor-pointer">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentProductIndex}
              className="absolute top-0 left-0 right-0 grid grid-cols-1 justify-items-center sm:justify-items-start
               sm:grid-cols-2 md:grid-cols-4 gap-[1.5rem]"
              custom={direction}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {similarProducts
                .slice(currentProductIndex, currentProductIndex + 4)
                .map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="relative border rounded-[8px] overflow-hidden bg-white"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    whileHover="hover"
                    whileTap="rest"
                  >
                    {product.discount && (
                      <span className="absolute top-[8px] left-[8px] bg-purple-600 text-white px-[8px] py-[4px] 
                       rounded-[4px] text-[14px] z-20">
                        {product.discount}
                      </span>
                    )}
                    <div className="p-[1rem] flex flex-col justify-between w-[300px] sm:w-auto">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto mb-[1rem] object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 250, damping: 20 }}
                      />
                      <div>
                        <div className="flex items-center gap-[4px] mb-[8px]">
                          {Array.from({ length: product.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-[16px] h-[16px] fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="font-bold mt-[4px]">{product.price}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>

          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="absolute left-1/2 sm:left-[-1rem] top-[-20px] sm:top-1/2 transform rotate-90 sm:rotate-0
             sm:-translate-y-1/2 bg-white p-[8px] rounded-full shadow-md"
            onClick={handlePrevProduct}
          >
            <ChevronLeft className="w-[1.5rem] h-[1.5rem]" />
          </motion.button>

          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="absolute right-1/2 sm:right-[-1rem] bottom-[-35px] sm:bottom-0 sm:top-1/2 transform rotate-90 
             sm:rotate-0 -translate-y-1/2 h-[40px] bg-white p-[8px] rounded-full shadow-md"
            onClick={handleNextProduct}
          >
            <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
          </motion.button>
        </div>
      </div>
    )
}