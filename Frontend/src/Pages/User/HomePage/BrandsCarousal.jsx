import React, { useState } from "react"

import { motion } from "framer-motion"


export default function BrandsCarousal(){
  
  const logos = [
    {
      id: 1,
      name: "Nike",
      src: "/Images/logos/nike-logo-black.jpg",
    },
    {
      id: 2,
      name: "Adidas",
      src: "/Images/logos/adidas-logo.png",
    },
    {
      id: 4,
      name: "Under Armour",
      src: "/Images/logos/under-armour-inspired-logo.png",
    },
    {
      id: 6,
      name: "New Balance",
      src: "/Images/logos/new-balance-logo.jpg",
    },
    {
      id: 7,
      name: "Lululemon",
      src: "/Images/logos/lululemon-logo.png",
    },
    {
      id: 8,
      name: "Gymshark",
      src: "/Images/logos/gymshark-logo.jpg",
    },
    {
      id: 9,
      name: "Tuff Stuff",
      src: "/Images/logos/tuff-stuff-fitness-logo.jpg",
    },
    {
      id: 10,
      name: "True Fitness",
      src: "/Images/logos/true-fitness-logo.jpg",
    },
    {
      id: 15,
      name: "Unified Fitness",
      src: "/Images/logos/unified-fitness.jpg",
    },
    {
      id: 18,
      name: "Spirit",
      src: "/Images/logos/spirit-fitness-logo.jpg",
    },
    {
      id: 19,
      name: "Humane",
      src: "/Images/logos/humane-flooring-logo.jpg",
    },
  ]

  const duplicatedLogos = [...logos, ...logos, ...logos]

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full bg-white px-8 py-[5px] xxs-sm:py-4 md:py-8 overflow-hidden">
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="flex overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-16 md:gap-24 px-8 md:px-12"
            animate={{
              x: isHovered ? 0 : -2400,
            }}
            transition={{
              duration: isHovered ? 0 : 25,
              ease: "linear",
              repeat: isHovered ? 0 : Number.POSITIVE_INFINITY,
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 flex items-center justify-center min-w-max"
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="relative h-20 w-32 md:h-[5rem] md:w-[7rem] flex items-center justify-center">
                  <img
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.name}
                    fill
                    className="object-contain h-20 w-32 md:h-[5rem] md:w-[8rem] "
                    priority={false}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

