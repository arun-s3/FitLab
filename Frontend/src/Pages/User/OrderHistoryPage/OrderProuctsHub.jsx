import React, {useEffect, useState} from 'react'
import './OrderHistoryPage.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion} from 'framer-motion'

import {ShoppingBag, ShoppingCart, Star, MoreHorizontal, X, CheckCircle, RefreshCcw, Package, CircleOff  }  from 'lucide-react'
import {BiCartAdd} from "react-icons/bi"
import {format} from "date-fns"

import RefundMessage from './RefundMessage'
import useFlexiDropdown from '../../../Hooks/FlexiDropdown'
import {CustomPuffLoader} from '../../../Components/Loader//Loader'
import {deleteProductFromOrderHistory} from '../../../Slices/orderSlice'


export default function OrderProuctsHub({order, product, onOpenOrderDetailsModal, onAddToCart, onCancelOrReturnProduct, 
        onCancelReturnReq, onOpenChat}){
            
    const [currentProductId, setCurrentProductId] = useState(null)
    const [showLoader, setShowLoader] = useState(false)

    const [showMoreMenuOf, setShowMoreMenuOf] = useState(null)

    const {openDropdowns, dropdownRefs, toggleDropdown} = useFlexiDropdown(['showMoreDropdown'])

    const returnWindowTime = 30 * 24 * 60 * 60 * 1000
    const cancelWindowTime = 30 * 24 * 60 * 60 * 1000

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {productDeleted, loading} = useSelector(state=> state.order)

    useEffect(()=> {
      if(!loading){
        setTimeout(()=> setShowLoader(false), 1000)
      }
      else setShowLoader(true)
    },[loading])

    const orderStatusStyles = [
      {status:'processing', textColor:'text-orange-500', bg:'bg-orange-500', lightBg:'bg-orange-50', border:'border-orange-300', shadow: '#fdba74'},
      {status:'confirmed', textColor:'text-yellow-500', bg:'bg-yellow-500', lightBg:'bg-yellow-50', border:'border-yellow-300', shadow: '#fde047'},
      {status:'shipped', textColor: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-300', shadow: '#93c5fd'},
      {status:'delivered', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'}, 
      {status:'cancelled', textColor:'text-red-700', bg:'bg-red-700', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'returning', textColor:'text-red-500', bg:'bg-red-500', lightBg:'bg-red-50', border:'border-red-300', shadow: '#fca5a5'},
      {status:'refunded', textColor:'text-green-500', bg:'bg-green-500', lightBg:'bg-green-50', border:'border-green-300', shadow: '#86efac'},
    ]

    const variantSymbol = {weight: 'Kg', motorPower: 'Hp', color: '', size: ''}

    const findStyle = (status, styler)=> {
      return orderStatusStyles.find(orderStatus=> orderStatus.status === status)[styler]
    }

    const viewProduct = async(id)=> {
      navigate(`/shop/product?id=${id}`)
    }

    const clearProduct = (orderId, productId)=> {
      console.log("Clearing the product...")
      dispatch(deleteProductFromOrderHistory({orderId, productId})) 
    }


    return(
                              
          <div className="flex gap-[2rem]">
            <figure className="w-[120px] h-[120px] bg-gray-50 rounded-xl overflow-hidden">
              <img src={product.thumbnail} alt={product.title} className={`w-full h-full object-cover transform
                   hover:scale-105 transition-transform duration-200
                     ${product.productStatus === 'cancelled' || product.productStatus === 'returning' ? 'filter grayscale' : ''} `}/>
            </figure>
            <div className="flex-1">
              <h4 className="mb-[8px] flex items-center gap-[4rem]">
                <span className='text-gray-800 font-bold hover:text-secondary transition-colors cursor-pointer'>
                  <span className='capitalize'> {product.title} </span>
                  <span className='ml-[3px] capitalize text-[#a09fa8]'> 
                    {
                        product.productId?.variantType 
                        ? ' - ' + ' ' + product.productId[`${product.productId.variantType}`] 
                          + ' ' + variantSymbol[`${product.productId.variantType}`]
                        : ''
                    }
                  </span>
               </span>
                {
                  order.products.some(item=> product.productStatus !== item.productStatus) &&  
                  <span className='px-[5px] py-[3px] w-[10%] flex gap-[10px] items-center'>
                     <span className={`w-[7px] h-[7px] ${ findStyle(product.productStatus, 'bg') } rounded-[5px]`} 
                         style={{boxShadow: `0px 0px 6px 3px  ${findStyle(product.productStatus, 'shadow')}`}}>
                     </span>
                     <span className={`capitalize ${ findStyle(product.productStatus, 'textColor') } text-[13px] font-[500]`}>
                       {product.productStatus}
                     </span>
                  </span>
                } 
              </h4>
              <p className="mb-[8px] text-[13px] text-gray-600">{product.subtitle}</p>
              {
              !product.productReturnStatus &&
                <p className="w-fit text-[13px] text-gray-500 tracking-[0.3px] flex items-center gap-[4px]
                    hover:text-secondary transition-colors duration-300 cursor-default"
                >
                { product.productStatus === 'cancelled'||product.productStatus === 'returning' ?
                     <CircleOff className="w-[1rem] h-[1rem]"/> : <RefreshCcw className="w-[1rem] h-[1rem]" /> 
                }
                { !product.productReturnStatus && product.productStatus === 'cancelled' 
                    ? 'This product is cancelled' 
                    : product.productStatus === 'refunded' 
                    ? 'This product has been refunded'
                    : product.productStatus === 'returning' 
                    ? 'Applied for return request'
                    : product?.productReturnStatus === 'rejected'
                    ? 'Return request has been rejected'
                    : product.productStatus === 'delivered' 
                    ? Date.now() <= new Date(order.deliveryDate).getTime() + returnWindowTime 
                    ? 'Return item: Eligible through ' + 
                          format( new Date(order.deliveryDate).getTime() + returnWindowTime, "MMMM dd, yyyy" )
                    : 'Return date expired'
                    : null
                }
                { !['cancelled', 'returning', 'refunded', 'delivered'].includes(product.productStatus) 
                    ? Date.now() > new Date(order.orderDate).getTime() + cancelWindowTime 
                    ? <span className='ml-[10px]'> Cancel Item: Not allowed as the 30-day period has expired. </span>
                    : <span className='ml-[10px]'> Cancel Item: eligible within 30 days of delivery only. </span>
                    : null
                }
              </p>
              }
              {product.deliveryNote && (
                <p className="mt-[8px] text-[13px] leading-[20px] text-gray-500 flex items-center gap-[4px]">
                  <Package className="w-[1rem] h-[1rem]" />
                  {product.deliveryNote}
                </p>
              )}
              <div className="relative flex gap-[12px] mt-[1.5rem] item-buttons">
                <button className="px-[16px] py-[4px] text-[14px] text-white bg-gradient-to-r from-[#B863F2]
                   to-secondary flex items-center gap-[8px] rounded-[7px] hover:shadow-md transition-all duration-300 
                        transform hover:!bg-purple-800 hover:translate-y-px"
                         onClick={()=> {onAddToCart(product.productId); setCurrentProductId(product.productId)}}>
                  {
                    product.productStatus === 'cancelled'||product.productStatus === 'returning' ?
                        <> <ShoppingCart className="w-[1rem] h-[1rem]" /> Buy </>
                      : <> <BiCartAdd className="w-[1rem] h-[1rem]" /> Buy it again </>
                  }
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="hover:!bg-primary hover:!text-secondary hover:!border-yellow-300 
                    !transition !duration-300"
                    onClick={()=> viewProduct(product.productId._id)}
                > 
                   {product.productStatus === 'cancelled'||product.productStatus === 'returning' ? 'View this item' : 'View your item'}
                </motion.button>
                  {
                   !['cancelled', 'returning', 'refunded'].includes(product.productStatus) 
                      && !product.productReturnStatus &&
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="hover:!bg-primary hover:!text-secondary transition duration-300"
                          onClick={(e)=> onCancelOrReturnProduct(e, product.productId, order._id, order.orderDate)}> 
                      {
                        product.productStatus === 'delivered' 
                           ? 'Return Product' 
                           : 'Cancel Product'
                      }
                    </motion.button>
                  }
                  { (product.productStatus === 'cancelled' || product.productStatus === 'refunded') && 
                    <motion.button 
                      className="hover:!bg-primary hover:!text-secondary transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                          onClick={(e)=> clearProduct(order._id, product.productId._id)}> 
                      Clear this item
                    </motion.button>
                  }
                  { (product.productStatus === 'returning') && 
                    <motion.button 
                      className="hover:!bg-primary hover:!text-secondary transition duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={(e)=> onCancelReturnReq(order._id, product.productId._id, 'product')}> 
                      Cancel return request
                    </motion.button>
                  }
                { product.productId?._id &&
                <button className="border !border-primary hover:border-gray-300 transition-all duration-200"
                  ref={dropdownRefs.showMoreDropdown}
                  onClick={()=> {
                    toggleDropdown('showMoreDropdown')
                    setShowMoreMenuOf(product?.productId?._id)
                  }}
                >      
                  <MoreHorizontal className="w-[20px] h-[20px] text-primaryDark" />
                  {
                    openDropdowns.showMoreDropdown && showMoreMenuOf === product?.productId?._id &&
                    <ul className='absolute !bottom-10 !right-[46%] bg-gray-50 border
                       border-dropdownBorder py-4 rounded-[7px]'
                    >
                      <li className='w-fit px-4 pb-[10px] flex items-center gap-[10px] 
                        border-b border-dropdownBorder hoevr:bg-100 hover:text-secondary 
                        transition-colors duration-300'
                        onClick={()=> {
                          onOpenOrderDetailsModal()
                        }}
                      > 
                          <ShoppingBag className='w-[15px] h-[15px] text-muted'/>
                          <span className='text-[14px] text-inherit'>
                             View Complete Order details  
                          </span>
                      </li>
                      <li className='w-fit px-4 pt-[10px] flex items-center gap-[10px] 
                      hover:text-secondary transition-colors duration-300'>
                          <Star className='w-[15px] h-[15px] text-muted text-inherit'/>
                          <span className='text-[14px] text-inherit'>  Give Feedback  </span>
                      </li>
                    </ul>
                  }

                </button>
              }

                { showLoader && currentProductId === product.productId?._id &&    
                   <CustomPuffLoader loading={showLoader} 
                       customStyle={{marginLeft: '5px', alignSelf: 'center'}}/>
                }

              </div>

                {
                  product.productStatus === 'returning' && product?.productReturnStatus && 
                    product.productReturnStatus === 'accepted' && !order.orderReturnStatus 

                      ? <RefundMessage 
                            refundReqAccepted={true} 
                            onOpenChat={onOpenChat}
                        />

                      : order.orderStatus === 'delivered' && order?.orderReturnStatus &&
                         order.orderReturnStatus === 'rejected' && !order.orderReturnStatus 

                      ? <RefundMessage 
                            refundReqAccepted={false} 
                            onOpenChat={onOpenChat}
                        />

                      : null
                  }           

            </div>
          </div>

    )
}



