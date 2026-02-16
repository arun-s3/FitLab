import React, {useState, useEffect} from 'react'
import './CartSidebar.css'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {X, Minus, Plus, ChevronRight, ShoppingCart, SquareArrowOutUpLeft, Trash, Trash2, Check, BadgePlus} from 'lucide-react'
import {toast} from 'react-toastify'
import {toast as sonnerToast} from 'sonner'

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
      setPackedupCart(cart)
    }
    if(error){
      sonnerToast.error(error, {description: "Please try again!"})
      dispatch(resetCartStates())
    }
    if(error && error.toLowerCase().includes('product')){
      toast.error(error)
      dispatch(resetCartStates())
    }
    if(productAdded){
      setPackedupCart(cart)
      dispatch(resetCartStates())
    }
    if(productRemoved){
      setPackedupCart(cart)
      sonnerToast.info("Product removed from cart")
      dispatch(resetCartStates())
    }
  },[error, productAdded, productRemoved, cart])

  useEffect(()=> {
    if(packedupCart?.products && packedupCart.products.length <= 0){
      onClose()
    }
  },[packedupCart])

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
    dispatch( removeFromCart({productId: id}) )
  }


  return (
          <>

    <ProductRemovalModal isOpen={isProductRemovalModalOpen} productToRemove={productToRemove} onConfirm={confirmProductRemoval}
       onCancel={cancelProductRemoval}/>

    <div id='ProductDetailSidebar' className={`fixed ${scaleDownSidebar ? 'top-[55%] h-auto border border-dropdownBorder'
      :'top-0 h-full'} top-0 right-0 ${ (retractedView || scaleDownSidebar) ? 'w-[140px] xxs-sm:w-[160px]' : 'w-full max-w-[280px] xs-sm:max-w-[300px] lg:w-[400px]'} bg-white
         shadow-2xl rounded-l-2xl transform transition-transform duration-300 ease-in-out
           ${ isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className={`flex flex-col h-full ${scaleDownSidebar && 'w-[130px] xxs-sm:w-[150px]'} `}>
        <div className={`flex justify-between items-center p-3 xxs-sm:p-4 ${!scaleDownSidebar && 'border-b'} `}>
          <div className='flex gap-[4px] xxs-sm:gap-[5px] items-center'>
            {scaleDownSidebar && <ShoppingCart className='h-[17px] w-[17px] xxs-sm:h-[19px] xxs-sm:w-[19px] text-muted'/> }
            <h2 className={` ${scaleDownSidebar ? 'text-[11px] xxs-sm:text-[12px]' : retractedView ? 'text-[13px] xxs-sm:text-[14px]' : 'text-lg xxs-sm:text-xl'}
             font-bold text-gray-800`}> 
              Your Cart 
            </h2>
          </div>
          <i className="text-gray-500 hover:text-gray-700">
            {
             scaleDownSidebar ?
             <SquareArrowOutUpLeft className='w-[16px] h-[16px] xxs-sm:w-[18px] xxs-sm:h-[18px] text-secondary cursor-pointer' onClick={()=> setScaleDownSidebar(false)}/>
             : <X size={20} className='xxs-sm:size-[24px] text-secondary cursor-pointer' onClick={onClose}/> 
            }
          </i> 
        </div>

        {
          !scaleDownSidebar &&
          <div className={`flex-1 relative ${packedupCart?.products?.length > 4 ? 'overflow-y-scroll' : 'overflow-y-auto'} p-3 xxs-sm:p-4 space-y-3 xxs-sm:space-y-4`}>
          {  packedupCart && Object.keys(packedupCart).length === 0 || (packedupCart?.products && packedupCart.products.length === 0) ? (
            <p className={`h-full w-full text-muted capitalize flex items-center justify-center text-[13px] xxs-sm:text-[14px] ${retractedView && 'text-[13px] xxs-sm:text-[14px]'}`}>
               Your cart is empty 
            </p>
          ) : (
            packedupCart?.products.map((product)=> (
              <div key={product.productId._id} id='cart-product' className={`flex ${retractedView && 'flex-col gap-[8px] xxs-sm:gap-[10px]'} items-center
                 justify-between flex-wrap bg-gray-50 p-2 xxs-sm:p-3 rounded-lg shadow-sm`}>
                  {
                   retractedView ? 
                   <div className='flex gap-[4px] xxs-sm:gap-[5px]'>
                     <img src={product.thumbnail} alt={product.title} className="ml-[8px] xxs-sm:ml-[10px] w-[45px] h-[45px] xxs-sm:w-[50px] xxs-sm:h-[50px] rounded-lg object-cover"/>
                     <button className="self-start text-red-500 hover:text-red-700" onClick={()=> removeProductFromCart(product.productId._id, product.title)}>
                        <Trash2 className='h-[12px] w-[12px] xxs-sm:h-[13px] xxs-sm:w-[13px]'/>
                      </button>
                   </div>
                   : <img src={product.thumbnail} alt={product.title} className="w-[45px] h-[45px] xxs-sm:w-[50px] xxs-sm:h-[50px] rounded-lg object-cover"/>

                  }
                  {
                    !retractedView &&
                    <div className="flex-1 ml-2 xxs-sm:ml-3 min-w-0">
                      <h3 className="font-medium text-gray-800 text-[13px] xxs-sm:text-base truncate">
                        {product.title}
                      </h3>
                      <p className="text-[10px] xxs-sm:text-[11px] text-secondary truncate"> 
                        <span className={` ${product?.offerApplied && product?.offerDiscount && 
                        'mr-[3px] xxs-sm:mr-[4px] line-through decoration-[1.6px] decoration-red-500'}` }>
                            &#8377;{product.price} 
                        </span> 
                        {
                        product?.offerApplied && product?.offerDiscount &&
                        <span> ₹{(product.price - product.offerDiscount).toFixed(2)} </span>
                        }
                        x {product.quantity} = &#8377;{product.total.toFixed(2)}
                      </p>
                    </div>
                  }
                  <div className={`flex items-center space-x-1 xxs-sm:space-x-2`}>
                    <button onClick={()=> lessenQuantity(product.productId._id, 1)} 
                      className={`p-1 bg-gray-200 hover:bg-gray-200 rounded-[4px]`}>
                      <Minus size={14} className='xxs-sm:size-[16px] h-[9px] w-[9px] xxs-sm:h-[10px] xxs-sm:w-[10px] text-secondary'/>
                    </button>
                    <span className={` ${retractedView ? 'text-[12px] xxs-sm:text-[13px]' : 'text-[11px] xxs-sm:text-[12px]'} text-gray-800 font-[500]`}>{product.quantity}</span>
                    <button onClick={()=> addQuantity(product.productId._id, 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-200 rounded-[4px]">
                      <Plus size={14} className='xxs-sm:size-[16px] h-[9px] w-[9px] xxs-sm:h-[10px] xxs-sm:w-[10px] text-secondary'/>
                    </button>
                    {
                      !retractedView &&
                        <button onClick={()=> removeProductFromCart(product.productId._id, product.title)} className="text-red-500 hover:text-red-700 ml-1 xxs-sm:ml-2">
                          <Trash className='h-[14px] w-[14px] xxs-sm:h-[15px] xxs-sm:w-[15px]'/>
                        </button>
                    }
                  </div>
                  {
                    product?.offerApplied && product?.offerDiscount &&
                    <p className={` ${!retractedView && 'mt-[8px] xxs-sm:mt-[10px] w-full'} px-[4px] xxs-sm:px-[5px] py-[2px] bg-inputBgSecondary flex items-center
                       gap-[2px] xxs-sm:gap-[3px] text-[9px] xxs-sm:text-[10px] text-secondary border border-inputBorderSecondary rounded-[4px] 
                        hover:underline hover:transition hover:duration-300 truncate`}>
                        <BadgePlus className='w-[12px] h-[12px] xxs-sm:w-[13px] xxs-sm:h-[13px] text-muted'/>
                        <span className="truncate">
                        {
                          `${product.offerApplied.discountType === 'percentage' ?
                         `${product.offerApplied.discountValue} %` : `₹ ${product.offerApplied.discountValue}`} Offer `
                        }
                        </span>
                        <Check className='w-[12px] h-[12px] xxs-sm:w-[13px] xxs-sm:h-[13px] text-green-500'/>
                    </p>
                  }
                  <i className='absolute top-[50%] left-[-3px] p-[4px] xxs-sm:p-[5px] bg-white border border-dropdownBorder border-l-white
                     rounded-[3px] shadow-sm z-[20] cursor-pointer' onClick={()=> setScaleDownSidebar(true)}>
                      <ChevronRight className='text-muted h-[14px] w-[14px] xxs-sm:h-[16px] xxs-sm:w-[16px]'/>
                   </i>
              </div>
            ))
          )}
        </div>
        }
        { Object.keys(packedupCart).length > 0 && packedupCart?.products && packedupCart.products.length > 0 && !scaleDownSidebar &&
           <div className="border-t p-3 xxs-sm:p-4 bg-white sticky bottom-0">
             <div className={`flex justify-between items-center font-bold ${retractedView ? 'text-[10px] xxs-sm:text-[11px]' : 'text-base xxs-sm:text-lg'} text-gray-800 mb-2 xxs-sm:mb-3`}>
               <span>Total:</span>
               <span>&#8377; {packedupCart.absoluteTotal ? packedupCart.absoluteTotal.toFixed(2) : null} </span>
             </div>

             {
              !retractedView &&
              <SiteSecondaryFillImpButton clickHandler={()=> navigate('/checkout')} className="w-full text-[13px] xxs-sm:text-base py-2 xxs-sm:py-2.5 mb-2">
                Proceed to Checkout
              </SiteSecondaryFillImpButton>
             }

             <SiteSecondaryFillImpButton variant='outline' clickHandler={()=> navigate('/cart')} 
                className="w-full text-[12px] xxs-sm:text-[13px] py-2 xxs-sm:py-2.5"
                customStyle={retractedView ? {paddingBlock: '3px', fontSize:'12px xxs-sm:text-[13px]'} : {}}>
                Go To Cart
              </SiteSecondaryFillImpButton>

           </div>
        }  
       
      </div>

    </div>

    </>
  )
}

