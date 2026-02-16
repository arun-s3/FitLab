import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {motion, AnimatePresence} from 'framer-motion'

import {ChevronLeft, ChevronRight} from 'lucide-react'
import apiClient from "../../Api/apiClient"

import StarGenerator from '../StarGenerator/StarGenerator'


export default function SimilarProductsCarousal({titleColor = null, referenceProductIds}){

    const [similarProducts, setSimilarProducts] = useState([])
    const [currentProductIndex, setCurrentProductIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const [fetchError, setFetchError] = useState(false)

    const navigate = useNavigate()

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL
  
    useEffect(()=> {
      async function loadProducts(){
        try{
          const response = await apiClient.post(`${baseApiUrl}/products/similar`, {productIds: referenceProductIds})
          if(response?.data?.similarProducts) {
            setSimilarProducts(response.data.similarProducts)
          }
        }
        catch(error){
          if (!error.response) {
            setFetchError(true)
          } 
          if (error.response?.status !== 404 && error.response?.status !== 400) {
            setFetchError(true)
          }
        }  
      }
      loadProducts()
    }, [referenceProductIds])

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
      similarProducts && similarProducts.length > 0 &&
      (
        <section>
          <h2 className={`text-[1.5rem] ${titleColor ? `text-${titleColor}` : 'text-secondary'} font-bold mb-[2rem]`}>
            Similar Products
          </h2>

          <div className="relative h-auto min-h-[400px] cursor-pointer">

  <AnimatePresence custom={direction} initial={false}>
    <motion.div
      key={currentProductIndex}
      className="relative grid grid-cols-1 justify-items-center sm:justify-items-start
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
            className="border rounded-[17px] overflow-hidden bg-white"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            onClick={() =>
              navigate(
                { pathname: '/shop/product', search: `?id=${product.id}` },
                { state: { product } }
              )
            }
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
                          className="w-full h-auto mb-[1rem] object-cover rounded-[17px]"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 250, damping: 20 }}
                        />
                        <div>
                          <div className="text-secondary flex items-center gap-[4px] mb-[8px]">

                            <StarGenerator product={product} />

                            <span className='text-secondary text-[13px]'> ({`${product.totalReviews}`}) </span>
                          </div>
                          <h3 className="font-medium break-words whitespace-pre-wrap line-clamp-3">{product.name}</h3>
                          <p className="font-bold mt-[4px]">{product.price}</p>
                        </div>
                      </div>
          </motion.div>
        ))}
    </motion.div>
  </AnimatePresence>

  <button
    className="absolute right-[2%] top-[50%] -translate-y-1/2 bg-white p-[8px] border border-inputBorderLow 
        rounded-full shadow-md transform-gpu transition hover:scale-110 active:scale-95"
    onClick={handleNextProduct}
  >
    <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
  </button>

  <button
    className="absolute left-[2%] top-[50%] -translate-y-1/2 bg-white p-[8px] border border-inputBorderLow 
    rounded-full shadow-md transform-gpu transition hover:scale-110 active:scale-95"
    onClick={handlePrevProduct}
  >
    <ChevronLeft className="w-[1.5rem] h-[1.5rem]" />
  </button>
</div>


        </section>
      )
    )
}