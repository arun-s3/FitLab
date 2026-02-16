import React from 'react'
import {useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'

import {Plus, Minus, AlertCircle} from 'lucide-react'
import apiClient from '../../../Api/apiClient'
import {toast as sonnerToast} from 'sonner'

import {camelToCapitalizedWords} from '../../../Utils/helperFunctions'


export default function OrderManager({products, orderReviewError, onIncQuantity, onDecQuantity}){

    const baseApiUrl = import.meta.env.VITE_API_BASE_URL

    const navigate = useNavigate()
 
    const containerVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }

    const buttonVariants = {
      rest: { scale: 1 },
      tap: {
        scale: 0.85,
        transition: { type: "spring", stiffness: 400, damping: 12 },
      },
    }

    const variantSymbol = {weight: 'Kg', motorPower: 'Hp', color: '', size: ''}

    const goToProductDetailPage = async(id)=> {
      try {
        const response = await apiClient.get(`${baseApiUrl}/products/${id}`)
        let product = null
        if(response?.data){
            product = response.data[0]
            navigate('/shop/product', {state: {product}})
        }
      }catch(error){
        console.error(error)
         if (!error.response) {
              sonnerToast.error("Network error. Please check your internet.")
          } else {
              sonnerToast.error("Something went wrong! Please retry later.")
          }
      }
    }


    return(
        <motion.div className={`mt-[30px] grid grid-cols-1 x-sm:grid-cols-2 lg:grid-cols-1 xx-xl:grid-cols-2 gap-x-6 xx-xl:gap-x-[3rem] 
           gap-y-[1rem] ${products.length > 4 ? 'overflow-y-scroll' : 'overflow-y-auto'} overflow-x-hidden max-h-[40rem]`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
           {products &&
                products.map((product) => (
                    <motion.div 
                      key={product.productId}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    >
                      <div className="m-[5px] flex cursor-pointer bg-[#f9f4fb] p-[14px] rounded-[7px] hover:shadow-md
                       transition duration-300">
                        <img 
                          src={product.thumbnail} 
                          alt={product.title} 
                          className="w-20 h-20 object-cover rounded"
                          onClick={()=> goToProductDetailPage(product.productId)}
                        />
                        <div className="flex-1 flex flex-col justify-between ml-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-[15px] font-[450] uppercase" 
                                onClick={()=> goToProductDetailPage(product.productId)}
                              > 
                                {!product.title.length > 22 ? product.title : product.title.slice(0,15) + '...'}
                              </h3>
                              {/* {
                                product?.weight? 
                                <p className="text-sm text-[13px] text-gray-500"> Weight: { product.weight } </p>
                                : null
                              } */}
                              {
                                product.productId.variantType &&
                                  <p className="mt-[3px] text-[13px] text-muted font-[450]"> 
                                      {`${camelToCapitalizedWords(product.productId.variantType)}:`} 
                                    <span className='ml-[3px] text-[13px] capitalize'>
                                      {
                                        product.productId[`${product.productId.variantType}`] 
                                          + ' ' + variantSymbol[`${product.productId.variantType}`]
                                      } 
                                    </span>
                                  </p>
                              }
                            </div>
                          </div>
                          <div className="flex justify-between items-center gap-[30px] mt-2">
                            <div className="flex items-center space-x-2">
                              <motion.button 
                                className="w-[20px] h-[20px] flex items-center justify-center
                                 border-primaryDark border rounded hover:bg-[#f1f7cf] transition duration-300" 
                                onClick={()=> onDecQuantity(product.productId._id, 1, product.quantity)}
                                variants={buttonVariants}
                                whileTap="tap"
                                initial="rest"
                                animate="rest"
                              >
                                <Minus size={14} className='text-primaryDark'/>
                              </motion.button>
                              <span className="w-8 text-center text-[14px]"> {product.quantity} </span>
                              <motion.button 
                                className="w-[20px] h-[20px] flex items-center justify-center border-primaryDark border rounded
                                  hover:border-primaryDark hover:bg-[#f1f7cf] transition duration-300" 
                                onClick={()=> onIncQuantity(product.productId._id, 1)}
                                variants={buttonVariants}
                                whileTap="tap"
                                initial="rest"
                                animate="rest"
                              >
                                <Plus size={14} className='text-primaryDark'/>
                              </motion.button>
                            </div> 
                            <span className="text-[14px] font-[450] flex flex-col w-auto x-lg:w-[10rem]">
                              <span className={`${ product?.offerApplied && 'line-through decoration-[1.6px] decoration-red-500'}`}>
                                &#8377; {(product.price).toFixed(2)} 
                              </span>
                              { product?.offerApplied && product?.offerDiscount &&
                                <span className='w-full x-lg:w-[125%]'>
                                  ₹{(product.price - product.offerDiscount).toFixed(2)}
                                </span>
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      {
                        (product.productId.isBlocked || product.productId.stock < product.quantity) &&
                          <motion.div 
                            className=" flex items-center gap-1 mt-1"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <span className="text-xs text-red-600"> 
                              {   
                                !product?.productId 
                                  ? 'This product is unavailable!'
                                  : product.productId.isBlocked 
                                  ? 'This product is Blocked!'
                                  : product.productId.stock < product.quantity
                                  ? 'This product is out of stock!'
                                  : null
                              }
                            </span>
                          </motion.div>
                      }
                      <p className='mt-[5px] h-[5px] text-[10px] text-red-500 tracking-[0.3px]'> {orderReviewError} </p>
                    </motion.div>
                )
            )}
        </motion.div>
    )
}