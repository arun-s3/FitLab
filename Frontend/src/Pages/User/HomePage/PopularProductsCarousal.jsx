import React, {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import {motion, AnimatePresence} from "framer-motion"

import {ChevronLeft, ChevronRight, IndianRupee} from "lucide-react"
import axios from 'axios'


export default function PopularProductsCarousal() {

  // const [products, setProducts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = useNavigate()

  const products = [
    {
      id: 1,
      name: "Pro Dumbbells Set",
      price: "29999",
      image: "./professional-dumbbells-set-in-gym.jpg",
    },
    {
      id: 2,
      name: "Yoga Mat Premium",
      price: "3000",
      image: "./premium-yoga-mat-fitness.jpg",
    },
    {
      id: 3,
      name: "Treadmill Elite",
      price: "73000",
      image: "./modern-treadmill-gym-equipment.jpg",
    },
    {
      id: 4,
      name: "Resistance Bands",
      price: "1300",
      image: "./colorful-resistance-bands-set.jpg",
    },
  ]

  // const baseApiUrl = import.meta.env.VITE_API_BASE_URL
  
  // useEffect(()=> {
  //   async function loadProducts(){
  //     try{
  //       const response = await axios.get(`${baseApiUrl}/products/popular`, {withCredentials: true})
  //       console.log("RESPONSE from loadSlides---->", response)
  //       setProducts(response.data.popularProducts)
  //     }
  //     catch(error){
  //       console.log("error from  loadSlides--->", error.message)
  //     }  
  //   }
  //   loadProducts()
  // }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const getVisibleProducts = () => {
    const visible = []
    for (let i = 0; i < 4; i++) {
      visible.push(products[(currentIndex + i) % products.length])
    }
    return visible
  }

  const visibleProducts = getVisibleProducts()

  return (
    products && products.length > 0 &&
      (
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="mb-8 sm:mb-0">
                <p className="text-secondary font-semibold text-sm tracking-wide">TOP FITNESS PICKS</p>
                <h2 className="text-[30px] sm:text-[40px] font-bold text-gray-900">Most Popular Products</h2>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSlide}
                  className="bg-primary hover:bg-green-500 text-white p-3 rounded-lg transition-colors duration-200 
                    flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSlide}
                  className="bg-primary hover:bg-green-500 text-white p-3 rounded-lg transition-colors duration-200 
                    flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            </div>

            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4 sm:gap-6"
                initial={false}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${currentIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
                      onClick={()=> navigate(
                        {pathname: '/shop/product', search: `?id=${product.id}`}, 
                        {state: {product}}
                      )}
                    >
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-96 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                      >
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-6 left-6"
                        >
                          <button className="bg-primaryDark hover:bg-green-500 text-white font-semibold px-6 py-2 
                            rounded-[7px] text-sm transition-colors duration-200 shadow-md">
                              ADD TO CART
                          </button>
                        </motion.div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[16px] sm:text-[25px] font-bold mb-2 text-balance"
                          >
                            {product.name}
                          </motion.h3>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 text-white/90"
                          >
                            <IndianRupee size={18} className="text-white" />
                            <span className="text-[15px] font-semibold">{product.price}</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-green-600 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )
  )
}

