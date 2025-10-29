import React, {useEffect, useState, useContext} from 'react'
import {useSearchParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import {toast} from 'react-toastify'
import axios from 'axios'

import Header from '../../../Components/Header/Header'
import BreadcrumbBar from '../../../Components/BreadcrumbBar/BreadcrumbBar'
import ProductDetailSection from './ProductDetail'
import ReviewSystem from './ReviewSystem'
import SimilarProductsCarousal from '../../../Components/ProductsCarousal/SimilarProductsCarousal'
import {capitalizeFirstLetter} from '../../../Utils/helperFunctions'
import {addToCart, getTheCart, resetCartStates} from '../../../Slices/cartSlice'
import {getBestOffer} from '../../../Slices/offerSlice'
import CartSidebar from '../../../Components/CartSidebar/CartSidebar'
import AuthPrompt from '../../../Components/AuthPrompt/AuthPrompt'
import {ProtectedUserContext} from '../../../Components/ProtectedUserRoutes/ProtectedUserRoutes'
import Footer from '../../../Components/Footer/Footer'


export default function ProductDetailPage(){

  const {setIsAuthModalOpen, checkAuthOrOpenModal} = useContext(ProtectedUserContext)
  setIsAuthModalOpen({status: false, accessFor: 'shopping features'})

  const [quantity, setQuantity] = useState(1)

  const [activeTab, setActiveTab] = useState("description")

  const [isCartOpen, setIsCartOpen] = useState(false)

  const [productDetails, setProductDetails] = useState(null)

  const [searchParam, setSearchParam] = useSearchParams()
  const currentProductId = searchParam.get('id')

  const {cart, productAdded, loading, error} = useSelector(state=> state.cart)
  const {user} = useSelector(state=> state.user)

  const dispatch = useDispatch()

  const baseApiUrl = import.meta.env.VITE_API_BASE_URL

  useEffect(()=> {
    const fetchProduct = async()=> {
      const response = await axios.get(`${baseApiUrl}/products/${currentProductId}`, {withCredentials:true})
      console.log('response.data.product---->', response.data.product)
      return response.data.product 
    }
    const loadProduct = async()=> {
      if(currentProductId){
        const product = await fetchProduct()
        setProductDetails(product)
        dispatch( getBestOffer({productId: product._id, quantity}) )
      }
    }
    dispatch(resetCartStates())
    loadProduct()
  },[currentProductId])

  useEffect(()=> {
    if(cart?.products && cart.products.length > 0){
        setIsCartOpen(true)
      }
    if(error && error.toLowerCase().includes('product')){
      console.log("Error from ProductDetailPage-->", error)
      toast.error(error)
      dispatch(resetCartStates())
    }
    if(productAdded){
      console.log("Product added to cart successfully!")
      setIsCartOpen(true)
      dispatch(resetCartStates())
    }
  },[error, productAdded, cart])

  const headerBg = {
      backgroundImage: "url('/header-bg.png')",
      backgrounSize: 'cover'
  }
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  }

  const handleAddToCart = (product, variantValueIndex) => {
    if(checkAuthOrOpenModal()) return
    console.log(`Inside handleAddToCart()--Product---->${JSON.stringify(product)}, variantValueIndex---->, ${variantValueIndex}`)
    const requiredProductVariantId = variantValueIndex === 0 ? product._id : product.variants[variantValueIndex - 1]._id
    dispatch( addToCart({productId: requiredProductVariantId, quantity}) )
    console.log("Dispatched successfully")
  }

  const submitReviewHandler = ()=> {
    if(checkAuthOrOpenModal()) return
    console.log('Submitting reveiw...')
  }


  return (
    <>
    {
      productDetails &&
        <section id='ProductDetailPage'>
        <header style={headerBg} className='h-[5rem]'>

            <Header />

        </header>

        <BreadcrumbBar heading='Product Details'/>

        <motion.main 
          className='flex gap-[2rem] px-[10px] xxs-sm:px-[4rem] mb-[10rem]'
          variants={sectionVariants}
          initial="hidden"
          animate="show"
        >
          <div className="container mx-auto px-[12px] xs-sm:px-[16px] py-[24px] s-sm:py-[32px]">

              {
                productDetails &&
                  <ProductDetailSection 
                    product={productDetails} 
                    quantity={quantity} 
                    setQuantity={setQuantity} 
                    onAddToCart={handleAddToCart} 
                    isLoading={loading}
                  />
              }

              <div className="mt-[64px]">
                <div className="border-b">
                  <nav className="flex space-x-[29px] xxs-sm:space-x-[32px]">
                    {['Description', 'Additional Info', 'Reviews'].map((tab) => (
                      <button 
                        key={tab.toLowerCase()} 
                        onClick={()=> setActiveTab(tab.toLowerCase())}
                        className={`py-[16px] px-[4px] border-b-2 font-medium text-[14px] 
                          ${activeTab === tab.toLowerCase() ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="mt-[32px]">
                  <AnimatePresence mode="wait">
                    {
                      activeTab === 'description' && (
                        <motion.div
                          key="description"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          {productDetails.description &&
                            <>
                              <h2 className="text-[17px] font-bold mb-[16px]"> Product Description </h2>
                              <p className='text-gray-600 text-[14px] xs-sm:text-base leading-relaxed break-words
                                whitespace-normal max-w-full overflow-hidden'>
                                   {capitalizeFirstLetter(productDetails.description)} 
                                </p>
                            </>
                          }
                        </motion.div>
                    )}
  
                    {
                      activeTab === 'additional info' && 
                        productDetails.additionalInformation &&
                          <>
                            <motion.div
                              key="additional-info"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <h2 className="text-[17px] font-bold mb-[16px]"> Additional Information </h2>
                              <ul className="list-disc list-inside space-y-[8px]">
                                {
                                  productDetails.additionalInformation.map(info=> (
                                    <li>
                                      {capitalizeFirstLetter(info)}
                                    </li>
                                  ))
                                }
                              </ul>
                            </motion.div>
                          </>
                    }
  
                    {
                      activeTab === 'reviews' && 
                        <motion.div
                          key="reviews"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >

                          <ReviewSystem onReviewSubmit={submitReviewHandler}/>

                        </motion.div>
                    }
                  </AnimatePresence>
                </div>
              </div>

              {
                !user &&
                  <div className='mt-8 flex justify-center'>
                  
                    <AuthPrompt />

                  </div>
              }
              
              <div className="mt-[4rem]">
                {
                  productDetails &&
                    <SimilarProductsCarousal titleColor='black' referenceProductIds={[currentProductId]}/>
                }
              </div>

              <div className='max-md:hidden'> 
                <CartSidebar 
                  isOpen={isCartOpen} 
                  onClose={()=> setIsCartOpen(false)}
                />
              </div>

              <div className='md:hidden'> 
                <CartSidebar 
                  isOpen={isCartOpen} 
                  onClose={()=> setIsCartOpen(false)} 
                  retractedView={true}
                />
              </div>

            </div>

        </motion.main>
        
        <Footer/>

    </section>

    }
    </>
  )
}


