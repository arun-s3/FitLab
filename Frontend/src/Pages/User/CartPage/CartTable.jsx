import React from 'react'
import {motion, AnimatePresence} from "framer-motion"

import {Trash2, Plus, Minus, BadgePlus} from 'lucide-react'

import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'


export default function CartTable({products, omIncQuantity, onDecQuantity, onRemoveProduct}){

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          staggerChildren: 0.08, 
          when: "beforeChildren",
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 18 },
      },
    }


    return (
        <>
            <motion.div 
              className="bg-muted text-[12px] x-sm:text-[14px] font-[430] text-white grid grid-cols-4 p-[0.5rem] s-sm:p-[1rem]
               rounded-t-[8px]"
              variants={itemVariants}
            >
              <div className="truncate">ITEMS</div>
              <div className="text-center truncate">PRICE</div>
              <div className="text-center truncate">QTY</div>
              <div className="text-center truncate">SUBTOTAL</div>
            </motion.div>
            <div className={`border rounded-b-[8px] max-h-[40rem]
             ${products.length > 4 ? 'overflow-y-scroll' : 'overflow-y-auto'} overflow-x-hidden`}
              variants={containerVariants}
            >
              <AnimatePresence>
                {   
                    products &&
                    products.map(product => (
                        <motion.div key={product.productId} 
                          className="grid grid-cols-4 items-center p-[0.5rem] s-sm:p-[1rem] border-b last:border-b-0"
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                        >
                          <div className="flex items-center space-x-[0.5rem] s-sm:space-x-[1rem]">
                            <img src={product.thumbnail} 
                              alt={product.title} 
                              className="w-[4rem] h-[4rem] mob:w-[5rem] mob:h-[5rem] s-sm:w-[6rem] s-sm:h-[6rem] object-cover rounded
                                transition hover:scale-105 duration-150 cursor-pointer"/>
                            <div className="min-w-0 hidden xs-sm:inline-block">
                              <h3 className="text-[13px] s-sm:text-[15px] text-secondary font-medium capitalize truncate"> 
                                {product.title}
                              </h3>
                              {product?.category.length > 0 &&
                                <div className='hidden xs-sm:inline-block'>
                                  <p className="text-[11px] hidden sm:inline-block text-mutedLight truncate"> 
                                    {'CAT: '+ product.category.map(cat=> capitalizeFirstLetter(cat)).toString()} 
                                  </p>
                                  <p className="text-[11px] inline-block sm:hidden text-mutedLight truncate"> 
                                    {product.category.map(cat=> capitalizeFirstLetter(cat)).toString()} 
                                  </p>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="text-center text-[13px] s-sm:text-[15px] tracking-[0.3px]">
                            <p>
                              <span className={`${product?.offerApplied && product?.offerDiscount && 
                                'mr-[5px] x-sm:mr-[10px] line-through decoration-[1.6px] decoration-red-500'}`}>
                                ₹{(product.price)} 
                              </span> 
                              {
                                product?.offerApplied && product?.offerDiscount &&
                                <span> ₹{(product.price - product.offerDiscount).toFixed(2)} </span>
                              }
                            </p>
                            {
                            product?.offerApplied && product?.offerDiscount &&
                            <p className='ml-[1rem] x-sm:ml-[2rem] px-[3px] x-sm:px-[5px] py-[2px] flex items-center gap-[2px] 
                              x-sm:gap-[3px] text-[9px] s-sm:text-[10px] text-secondary'>
                              <BadgePlus className='w-[11px] h-[11px] s-sm:w-[13px] s-sm:h-[13px] text-muted'/>
                              <span className="truncate">
                              {
                                `${product.offerApplied.discountType === 'percentage' ?
                               `${product.offerApplied.discountValue} %` : `₹ ${product.offerApplied.discountValue}`} Offer `
                              }
                              </span>
                              <span className='capitalize truncate hidden x-sm:inline'>
                                - {product.offerApplied.name}
                              </span>
                            </p>
                            }
                          </div>
                          <div className="flex items-center justify-center space-x-[5px] s-sm:space-x-[8px]">
                            <button className="p-[3px] s-sm:p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" 
                              style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                              onClick={()=> onDecQuantity(product.productId._id, 1)}
                            >
                              <Minus className="w-[8px] h-[8px] s-sm:w-[10px] s-sm:h-[10px] text-secondary" />
                            </button>
                            <span className="w-[1.5rem] s-sm:w-[2rem] text-center text-[13px] s-sm:text-[15px]"> {product.quantity} </span>
                            <button className="p-[3px] s-sm:p-[4px] bg-primary hover:bg-primaryDark rounded-[4px]" 
                              style={{boxShadow: '2px 2px 9px rgb(219, 214, 223)'}}
                              onClick={() => omIncQuantity(product.productId._id, 1)}
                            >
                              <Plus className="w-[8px] h-[8px] s-sm:w-[10px] s-sm:h-[10px] text-secondary" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-center flex-1 text-[13px] s-sm:text-[15px] tracking-[0.3px]">
                              ₹{product.total.toLocaleString()}
                            </span>
                            <button className="text-red-500 hover:text-red-700" 
                              onClick={()=> onRemoveProduct(product.productId._id, product.title)}
                            >
                              <Trash2 className="w-[14px] h-[14px] s-sm:w-[16px] s-sm:h-[16px]" />
                            </button>
                          </div>
                        </motion.div>
                    ))
                }
              </AnimatePresence>
            
            </div>
        </>
    )
} 