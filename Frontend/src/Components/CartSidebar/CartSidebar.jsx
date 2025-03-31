import React, {useState, useEffect} from 'react'
import './CartSidebar.css'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {X, Minus, Plus, ChevronRight, ShoppingCart, SquareArrowOutUpLeft, Trash, Trash2, Check, Circle, BadgePlus} from 'lucide-react'
import {toast} from 'react-toastify'

import {SiteSecondaryFillImpButton} from '../SiteButtons/SiteButtons'
import ProductRemovalModal from '../ProductRemovalModal/ProductRemovalModal'
import {addToCart, reduceFromCart, removeFromCart, getTheCart, resetCartStates} from '../../Slices/cartSlice'


export default function CartSidebar({ isOpen, onClose, retractedView }) {

  const [packedupCart, setPackedupCart] = useState({})

  const [scaleDownSidebar, setScaleDownSidebar] = useState(false)

  const [isProductRemovalModalOpen, setIsProductRemovalModalOpen] = useState(false)
  const [productToRemove, setProductToRemove] = useState({})

  const {cart, productAdded, productRemoved, loading, error, message} = useSelector(state=> state.cart)
  const navigate = useNavigate()

  const dispatch = useDispatch()


  useEffect(()=> {
    if(cart?.products){
      console.log("Inside useEffect of ProductList before setting packedupCart..", packedupCart)
      setPackedupCart(cart)
      // setIsCartOpen(true)
    }
    if(error && error.toLowerCase().includes('product')){
      console.log("Error from ProductDetailPage-->", error)
      toast.error(error)
      dispatch(resetCartStates())
    }
    if(productAdded){
      console.log("Product added to cart successfully!")
      setPackedupCart(cart)
      // setIsCartOpen(true)
      dispatch(resetCartStates())
    }
    if(productRemoved){
      setPackedupCart(cart)
      dispatch(resetCartStates())
    }
  },[error, productAdded, productRemoved, cart])

  useEffect(()=> {
    if(packedupCart){
      console.log("packedupCart--->", packedupCart)
    }
    if(packedupCart?.products && packedupCart.products.length <= 0){
      console.log("Closing sidebar...")
      onClose()
    }
    if(error){
      toast.error(error)
    }
  },[packedupCart])

  useEffect(()=> {
    console.log('productToRemove---->', productToRemove)
    console.log('isProductRemovalModalOpen---->', isProductRemovalModalOpen)
  },[productToRemove, isProductRemovalModalOpen,])

  const removeProductFromCart = (id, name)=> {
    setProductToRemove({id, name})
    setIsProductRemovalModalOpen(true)
  }

  const confirmProductRemoval = ()=> {
    if(productToRemove !== null){
      removeFromTheCart(productToRemove.id)
      setIsProductRemovalModalOpen(false)
      setProductToRemove({})
    }
  }

  const cancelProductRemoval = ()=> {
    setIsProductRemovalModalOpen(false)
    setProductToRemove({})
  }

  const addQuantity = (id, quantity) => {
    dispatch( addToCart({productId: id, quantity}) )
  }

  const lessenQuantity = (id, quantity) => {
    dispatch( reduceFromCart({productId: id, quantity}) )
  }
       
  const removeFromTheCart = (id) => {
    console.log("id--->", id)
    dispatch( removeFromCart({productId: id}) )
  }


  return (
    <>

    <ProductRemovalModal isOpen={isProductRemovalModalOpen} productToRemove={productToRemove} onConfirm={confirmProductRemoval}
       onCancel={cancelProductRemoval}/>

    <div id='ProductDetailSidebar' className={`fixed ${scaleDownSidebar ? 'top-[55%] h-auto border border-dropdownBorder'
      :'top-0 h-full'} top-0 right-0 ${ (retractedView || scaleDownSidebar) ? 'w-[160px]' : 'lg:w-[400px] sm:w-[300px]'} bg-white
         shadow-2xl rounded-l-2xl transform transition-transform duration-300 ease-in-out
           ${ isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className={`flex flex-col h-full ${scaleDownSidebar && 'w-[150px]'} `}>
        <div className={`flex justify-between items-center p-4 ${!scaleDownSidebar && 'border-b'} `}>
          <div className='flex gap-[5px] items-center'>
            {scaleDownSidebar && <ShoppingCart className='h-[19px] w-[19px] text-muted'/> }
            <h2 className={` ${scaleDownSidebar ? 'text-[12px]' : retractedView ? 'text-[14px]' : 'text-xl'}
             font-bold text-gray-800`}> 
              Your Cart 
            </h2>
          </div>
          <i className="text-gray-500 hover:text-gray-700">
            {
             scaleDownSidebar ?
             <SquareArrowOutUpLeft className='w-[18px] h-[18px] text-secondary cursor-pointer' onClick={()=> setScaleDownSidebar(false)}/>
             : <X size={24} className='text-secondary cursor-pointer' onClick={onClose}/> 
            }
          </i> 
        </div>

        {
          !scaleDownSidebar &&
          <div className={`flex-1 relative ${packedupCart?.products?.length > 4 ? 'overflow-y-scroll' : 'overflow-y-auto'} p-4 space-y-4`}>
          { packedupCart?.products ? packedupCart?.products?.length === 0 ? (
            <p className="h-full w-full text-muted capitalize flex items-center justify-center"> Your cart is empty </p>
          ) : (
            packedupCart?.products.map((product)=> (
              <div key={product.productId._id} id='cart-product' className={`flex ${retractedView && 'flex-col gap-[10px]'} items-center
                 justify-between bg-gray-50 p-3 rounded-lg shadow-sm`}>
                  {
                   retractedView ? 
                   <div className='flex gap-[5px]'>
                     <img src={product.thumbnail} alt={product.title} className="ml-[10px] w-[50px] h-[50px] rounded-lg object-cover"/>
                     {/* <button onClick={onClose} className=" text-gray-500 hover:text-gray-700">
                        <X size={15} className='text-red-500'/>
                      </button> */}
                      <button className="self-start text-red-500 hover:text-red-700" onClick={()=> removeProductFromCart(product.productId._id, product.title)}>
                        <Trash2 className='h-[13px] w-[13px]'/>
                      </button>
                   </div>
                   : <img src={product.thumbnail} alt={product.title} className="w-[50px] h-[50px] rounded-lg object-cover"/>

                  }
                  {
                    !retractedView &&
                    <div className="flex-1 ml-3">
                      <h3 className="font-medium text-gray-800">
                        { !product.title.length > 22 ? product.title : product.title.slice(0,22) + '...' }
                      </h3>
                      <p className="text-[11px] text-secondary"> 
                        &#8377;{product.price} x {product.quantity} = &#8377;{product.total.toFixed(2)}
                      </p>
                    </div>
                  }
                  <div className={`flex items-center space-x-2`}>
                    <button onClick={()=> lessenQuantity(product.productId._id, 1)} 
                      className={`p-1 bg-gray-200 hover:bg-gray-200 rounded-[4px]`}>
                      <Minus size={16} className='h-[10px] w-[10px] text-secondary'/>
                    </button>
                    <span className={` ${retractedView ? 'text-[13px]' : 'text-[12px]'} text-gray-800 font-[500]`}>{product.quantity}</span>
                    <button onClick={()=> addQuantity(product.productId._id, 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-200 rounded-[4px]">
                      <Plus size={16} className='h-[10px] w-[10px] text-secondary'/>
                    </button>
                    {
                      !retractedView &&
                        <button onClick={()=> removeProductFromCart(product.productId._id, product.title)} className="text-red-500 hover:text-red-700 ml-2">
                          <Trash className='h-[15px] w-[15px]'/>
                        </button>
                    }
                  </div>
                  {
                    product?.offerApplied && product?.offerDiscount &&
                    <p className='px-[5px] py-[2px] bg-inputBgSecondary flex items-center gap-[3px] text-[10px]
                     text-secondary border border-inputBorderSecondary rounded-[4px] hover:underline hover:transition hover:duration-300'>
                      {/* <p> */}
                        <BadgePlus className='w-[13px] h-[13px] text-muted'/>
                        <span>
                        {
                          `${product.offerApplied.discountType === 'percentage' ?
                         `${product.offerApplied.discountValue} %` : `₹ ${product.offerApplied.discountValue}`} Offer `
                        }
                        </span>
                        <Check className='w-[13px] h-[13px] text-green-500'/>
                      {/* </p> */}
                      {/* <p className='mt-[3px]'>
                        Applied!
                      </p> */}
                    </p>
                  }
                  <i className='absolute top-[50%] left-[-3px] p-[5px] bg-white border border-dropdownBorder border-l-white
                     rounded-[3px] shadow-sm z-[20] cursor-pointer' onClick={()=> setScaleDownSidebar(true)}>
                      <ChevronRight className='text-muted'/>
                   </i>
              </div>
            ))
          ) : null}
        </div>
        }
        { packedupCart?.products?.length !== 0 && !scaleDownSidebar &&
           <div className="border-t p-4 bg-white sticky bottom-0">
             <div className={`flex justify-between items-center font-bold ${retractedView ? 'text-[11px]' : 'text-lg'} text-gray-800`}>
               <span>Total:</span>
               <span>&#8377; {packedupCart.absoluteTotal ? packedupCart.absoluteTotal.toFixed(2) : null} </span>
             </div>

             {
              !retractedView &&
              <SiteSecondaryFillImpButton clickHandler={()=> navigate('/checkout')}>
                Proceed to Checkout
              </SiteSecondaryFillImpButton>
             }

             <SiteSecondaryFillImpButton variant='outline' clickHandler={()=> navigate('/cart')} 
                customStyle={retractedView ? {paddingBlock: '3px', fontSize:'13px'} : {}}>
                Go To Cart
              </SiteSecondaryFillImpButton>

           </div>
        }  
       
      </div>

    </div>

    </>
  )
}

