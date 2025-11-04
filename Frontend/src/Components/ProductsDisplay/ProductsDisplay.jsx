import React, {useState, useEffect} from 'react'
import './ProductsDisplay.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {motion, AnimatePresence} from 'framer-motion'

import axios from 'axios'
import {toast as sonnerToast} from 'sonner'
import {MdFavorite, MdFavoriteBorder} from "react-icons/md"
import {RiFileEditLine} from "react-icons/ri"
import {MdBlock} from "react-icons/md"
import {LuBadgeAlert} from "react-icons/lu"
import {Calendar, Tag, NotebookPen, ShieldAlert} from 'lucide-react'
import {format} from "date-fns"

import {getAllProducts, toggleProductStatus} from '../../Slices/productSlice'
import {addProductToList, removeProductFromList, getUserWishlist, getAllWishlistProducts, resetWishlistStates} from '../../Slices/wishlistSlice'
import WishlistModal from '../../Pages/User/WishlistPage/Modals/WishlistModal'
import WishlistOptionsModal from '../WishlistModals/WishlistOptionsModal'
import RemoveWishlistItemModal from '../WishlistModals/RemoveWishlistItemModal'
import Pagination from '../Pagination/Pagination'
import PaginationV2 from '../PaginationV2/PaginationV2'
import StarGenerator from '../StarGenerator/StarGenerator'
import AnimatedStarGenerator from '../AnimatedStarGenerator/AnimatedStarGenerator'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'
import {capitalizeFirstLetter, camelToCapitalizedWords} from '../../Utils/helperFunctions'
import {addToCart} from '../../Slices/cartSlice'
import ProductsTableView from './ProductsTableView'


export default function ProductsDisplay({gridView, showByTable, customGridViewStyles, currentPage, limiter, queryOptions, showTheseProducts, admin, 
  wishlistDisplay, currentList, setCurrentPage, totalPages, couponApplicableItems = null, checkAuthOrOpenModal = null}) {


  const dispatch = useDispatch()
  const {products:items, productCounts} = useSelector(state=> state.productStore)
  const [products, setProducts] = useState([])

  const [productIsHovered, setProductIsHovered] = useState()

  const navigate = useNavigate()

  const {wishlist, wishlistProducts, listCreated, listProductRemoved, listProductAdded, loading, wishlistError, wishlistSuccess} = useSelector(state=> state.wishlist)

  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
  const [isWishlistOptionsModalOpen, setIsWishlistOptionsModalOpen] = useState(false)
  const [selectedProductForWishlist, setSelectedProductForWishlist] = useState(null)

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [removeProductFromWishlist, setRemoveProductFromWishlist] = useState('')

  const [selectedList, setSelectedList] = useState(null)

  useEffect(()=> {
    dispatch(getUserWishlist())
  },[])

  useEffect(()=>{
    if(!admin && !wishlistDisplay){
      setProducts(items)
    }
    if(wishlistDisplay && wishlistProducts){
      console.log("wishlistProducts---->", wishlistProducts)
      let allWishlistProducts = wishlistProducts
      allWishlistProducts = allWishlistProducts.map(list=> {
          const {product, ...rest} = list
          const id = {productId: product._id}
          return {...id, ...product, ...rest}
      })
      console.log("allWishlistProducts---->", allWishlistProducts)
      setProducts(allWishlistProducts)
    }
  },[items, wishlistProducts])

  useEffect(()=>{
    admin && setProducts(showTheseProducts)
  },[showTheseProducts])

  useEffect(()=> {
    if(listProductAdded){
      sonnerToast.success("The product have been added to the Wishlist!")
      dispatch(resetWishlistStates())
    }
    if(listProductRemoved){
      sonnerToast.success("The product have been removed from the Wishlist!")
      dispatch(resetWishlistStates())
      if(wishlistDisplay){
        dispatch( getAllWishlistProducts({queryOptions}) )
      }
    }
    if(wishlistError && !wishlistError.includes('Unauthorized')){
      console.log("wishlistError--->", wishlistError)
      sonnerToast.error("The product have been removed from the Wishlist!")
      dispatch(resetWishlistStates())
    }
    if(wishlist){
      console.log("Wishlist---->", wishlist)
    }
  },[listProductAdded, listProductRemoved, wishlist, wishlistError])

  const wishlistPriorityDetails = [
    {name: 'high', value: 1, color: 'text-red-500', bg: 'bg-red-200'},
    {name: 'medium', value: 2, color: 'text-yellow-500', bg: 'bg-yellow-100'},
    {name: 'low', value: 3, color: 'text-green-500', bg: 'bg-green-200'}
  ]

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, height: 0 },
  }

  const child = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  }

  const variantSymbol = {weight: 'Kg', motorPower: 'Hp', color: '', size: ''}

  const handleAddToCart = (id)=> {
     if(checkAuthOrOpenModal && checkAuthOrOpenModal()) return
     
     console.log("Inside handleAddToCart()--")
     dispatch( addToCart({productId: id, quantity: 1}) )
     console.log("Dispatched successfully")
  }

  const openWishlistOptionsModal = (product)=> {
    setSelectedProductForWishlist(product)
    setIsWishlistOptionsModalOpen(true)
  }

  const openWishlistItemRemoveModal = (product) => {
    setSelectedProductForWishlist(product)
    let targetList
    console.log("product.--->", product)
    console.log("product._id--->", product._id)
    wishlistDisplay && console.log("productId--->", product.productId)
    console.log('wishlist---->', wishlist)
    if(!wishlistDisplay){
      targetList = wishlist.lists.find((list)=> list.products.find(item=> item.product === product._id))
    }
    else{
      targetList = wishlist.lists.find((list)=> list.products.find(item=> item.product === product.productId))
      setRemoveProductFromWishlist(product.productId)
    } 
    setSelectedList(targetList.name)
    setIsRemoveModalOpen(true)
  }

  const addToWishlist = (product)=> {
    if(checkAuthOrOpenModal && checkAuthOrOpenModal()) return
    const userCreatedListsExists = Object.keys(wishlist).length && wishlist?.lists.some(list=> list.name === 'Default Shopping List') 
                                    && wishlist?.lists.length > 1
    if(userCreatedListsExists){
      console.log("Has lists other than default list")
      openWishlistOptionsModal(product)
    }else{
      dispatch(addProductToList({productId: product._id}))
    }
  }

  const deleteFromWishlist = (product)=> {
    if(checkAuthOrOpenModal && checkAuthOrOpenModal()) return
    const productOfDefaultList = Object.keys(wishlist).length && wishlist?.lists.some(list=> {
       list.name === 'Default Shopping List' && list.products.some(item=> item.product === product._id)
    }) 
                                    
    if(productOfDefaultList){
      console.log("Inside productOfDefaultList ")
      dispatch(removeProductFromList({productId: product._id}))
    }else{
      console.log("Has lists other than default list")
      openWishlistItemRemoveModal(product)
    }
  }



  return (
    <>
      {
        wishlistDisplay && currentList && wishlist.lists.some(list=> list.name === currentList) &&
        (()=>{
          const list = wishlist.lists.find(list=> list.name === currentList)
          const index = wishlistPriorityDetails.findIndex(status=> status.value === list.priority)

          return(
          <div className='mx-[1.5rem] mb-[1rem] p-[1rem] flex flex-col gap-[15px] bg-inputBgSecondary rounded-[8px] shadow-sm'>
           <h2 className='flex justify-between items-center'> 
            <span className='text-secondary text-[16px] font-[600] tracking-[0.4px]'> {list.name} </span>
            <span className={`px-[12px] py-[2px] ${wishlistPriorityDetails[index].bg} ${wishlistPriorityDetails[index].color} 
              text-[11px] font-[500] capitalize tracking-[0.3px] rounded-[3px]`}>
                {wishlistPriorityDetails[index].name}
            </span>
           </h2> 
           <h4 className='text-[13px] text-muted'> { list.description } </h4>
           <h5 className='flex items-center gap-[1rem]'>
              <span className='inline-flex items-center gap-[7px] text-muted'>
                  <Calendar className='w-[13px] h-[13px]'/>
                  <span className='text-[11px]'> Created On: {format( new Date(list.createdAt), "MMMM dd, yyyy" )} </span>
              </span>
              <span className='inline-flex items-center gap-[7px] text-muted'>
                  <Tag className='w-[13px] h-[13px]'/>
                  <span className='text-[11px]'> { ` (${list.products.length} ${list.products.length === 1 ? 'item' : 'items'}) ` } </span>
              </span>
           </h5>
          </div>
          )
        }) ()
      }
      
     <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={`${
          gridView ?
          customGridViewStyles
          ? customGridViewStyles
          :`w-full grid gap-y-8 ${admin ? 'md:grid-cols-2' : 'x-sm:grid-cols-2'} xx-md:grid-cols-2 lg:grid-cols-2 
            xl:grid-cols-3 x-xl:grid-cols-3 gap-x-[4rem] x-sm:gap-x-[4rem] xx-md:gap-x-[10rem] lg:gap-x-[9rem] 
            ${admin ? 'xl:gap-x-[4rem]' : 'xl:gap-x-[2rem]'}` 
          : showByTable 
          ? '' 
          : 'flex flex-col gap-[2rem]'}
          ${wishlistDisplay && 'ml-[15px] xx-lg:ml-[1.5rem]'} ${products.length === 0 && '!flex !justify-center !items-center'}`} 
        id="products-display" 
        style={admin ? { justifyItems: 'center' } : {}}
      >  

      { !showByTable && products && products.length > 0 ?
        products.map((product)=> (
          <motion.div key={product._id} 
            variants={child}
            className={` ${gridView ? 'w-[275px] xx-md:w-[200px] lg:w-[275px]' : 'flex gap-[1rem] w-full'}`}
            onMouseEnter={()=> setProductIsHovered(product._id)} 
            onMouseLeave={()=> setProductIsHovered('')}
          >
            <figure className={`relative h-auto rounded-[10px] thumbnail cursor-pointer ${(wishlistDisplay && !gridView) 
              ? 'h-[300px]' : wishlistDisplay ? 'h-[250px]' : gridView ? 'h-[275px] xx-md:h-[200px] lg:h-[275px]' 
              : 'h-[275px]'} ${productIsHovered === product._id && 'shadow-lg'}`}
            >
              <img src={product?.thumbnail.url || product?.thumbnail || "/placeholder.svg" } 
                alt={product.title} 
                className={`rounded-[10px] 
                  ${(wishlistDisplay && !gridView) 
                    ? 'h-[300px]' 
                    : wishlistDisplay ? 'h-[250px]' 
                    : gridView ? 'h-[275px] xx-md:h-[200px] xx-md:w-[200px] lg:h-[275px] lg:w-[275px]' 
                    : 'h-[275px] w-[350px]'} object-cover`}
                onClick={()=> !admin && navigate({
                      pathname: '/shop/product', 
                      search: `?id=${product._id}`
                    }, 
                    {state: {product}}
                  )
                }
              /> 
              <figcaption 
                className={`${admin 
                    ? 'top-[2px] left-[-40px] md:left-[10px] l-md:left-[-40px] xx-lg:left-[10px] x-xl:left-[-40px]' 
                    : 'bottom-[12px]'} absolute w-full text-center`}>
                {
                 admin ?
                  <div className='w-[35px] md:w-[92%] l-md:w-[35px] xx-lg:w-[92%] x-xl:w-[35px] flex flex-col
                   md:flex-row l-md:flex-col xx-lg:flex-row x-xl:flex-col gap-[1rem] md:justify-between l-md:justify-normal 
                   xx-lg:justify-between x-xl:justify-normal text-secondary'>
                    <span data-label='Edit' 
                      className='w-[30px] md:bg-white l-md:bg-transparent xx-lg:bg-white x-xl:bg-transparent p-[5px] border rounded-[20px]
                        z-[2] flex items-center justify-center relative cursor-pointer md:border-mutedDashedSeperation
                        l-md:border-inputBorderLow xx-lg:border-mutedDashedSeperation x-xl:border-inputBorderLow admin-control' 
                      onClick={()=> admin && navigate({
                          pathname: '../edit', 
                          search: `?id=${product._id}`
                        }, 
                        {state: {product}}
                      )}
                    >
                      <i> <RiFileEditLine/> </i>
                    </span>
                    <span data-label='Block' 
                      className='w-[30px] md:bg-white l-md:bg-transparent xx-lg:bg-white x-xl:bg-transparent p-[5px] border rounded-[20px] 
                        z-[2] flex items-center justify-center relative cursor-pointer admin-control md:border-mutedDashedSeperation
                        l-md:border-inputBorderLow xx-lg:border-mutedDashedSeperation x-xl:border-inputBorderLow admin-control' 
                      onClick={()=> dispatch(toggleProductStatus(product._id))}>
                      <i> <MdBlock/> </i>
                    </span>
                  </div>
                  :
                  <SiteButtonSquare clickHandler={()=> {
                    if(!product.variantOf && !product.variants.length){
                      handleAddToCart(product._id)
                    } else{
                        navigate({
                            pathname: '/shop/product', 
                            search: `?id=${product._id}`
                          }, 
                          {state: {product}}
                        )
                    }}
                  } 
                      customStyle={{paddingBlock: '8px'}}
                      tailwindClasses='w-[12rem] xx-md:w-[9rem] lg:w-[12rem] text-[15px] xx-md:text-[14px] lg:text-[15px]'
                  >
                       { !product.variantOf && !product.variants.length ? 'Add to Cart' : 'View Product' }
                  </SiteButtonSquare>
                }
              </figcaption>
              { !admin &&
              <div className='absolute top-[15px] right-[15px] p-[5px] rounded-[15px] bg-white favourite'>
                <i className='cursor-pointer'> 
                  {!wishlistDisplay ?
                    Object.keys(wishlist).length > 0 ?
                      wishlist.lists.some(list=> list.products.some(item=> item.product === product._id)) ? 
                        <MdFavorite className='hover:scale-110 transition-transform duration-100' onClick={()=> deleteFromWishlist(product)}/> 
                        :<MdFavoriteBorder className='hover:scale-110 transition-transform duration-100' onClick={()=> addToWishlist(product)} /> 
                        :<MdFavoriteBorder className='hover:scale-110 transition-transform duration-100' onClick={()=> addToWishlist(product)} /> 
                    : <MdFavorite className='hover:scale-110 transition-transform duration-100' onClick={()=> deleteFromWishlist(product)}/>
                  } 
                </i>
              </div>
              }
            </figure>
            <div className={` ${gridView? 'mt-[10px] w-full flex flex-col gap-[5px] pl-[10px] py-[15px] rounded-[10px] product-infos' 
                                 : 'inline-flex flex-col gap-[10px] justify-between px-[1rem] py-[2rem] rounded-[10px] ml-[1rem] product-infos w-full'} 
                                    ${ wishlistDisplay && 'mr-[1rem]' } ${productIsHovered === product._id && 'shadow-lg'} cursor-pointer`}
                onClick={()=> !admin && navigate({
                          pathname: '/shop/product', 
                          search: `?id=${product._id}`
                        }, 
                        {state: {product}}
                )}
            >
              <div>

                 <p className='text-secondary flex items-center gap-[10px]'> 

                    {/* <StarGenerator product={product} /> */}

                    <AnimatedStarGenerator product={product}/>

                    <span className='text-secondary text-[14px] -mt-[11px]'> ({ product?.totalReviews || 0 }) </span> 
                  </p>

                <p className= {(gridView ? 'text-[15px] xx-md:text-[14px] lg:text-[15px]' : (admin && !gridView)? 'text-[15px]' 
                    : wishlistDisplay ? 'text-[16px] font-[500]' : 'text-[18px]')  
                      + ' mt-[10px] capitalize font-[450] line-clamp-2 hover:text-secondary hover:underline'} style={{wordBreak: 'break-word'}}>
                {product.title}
                </p>
              </div>
              {
                !gridView && 
                  <p className={`${( (admin && !gridView) || wishlistDisplay)? 'text-[12px]' : 'text-[14px]'} text-wrap 
                    break-words line-clamp-3`} style={{wordBreak: 'break-word'}}>
                       { capitalizeFirstLetter(product.subtitle) } 
                  </p>
              }
              <div>

                {
                  product.totalStock <= 5 &&
                  <p className='text-[13px] text-red-500 mb-[5px]'>
                     { product.totalStock <= 0 ? 'Out of Stock' :  `Only ${product.totalStock} items in Stock!`}
                  </p>
                }

                <p className={`${(admin && !gridView) 
                  ? 'text-[16px]' 
                  : (gridView) 
                  ? 'text-[16px] xx-md:text-[15px] lg:text-[16px]' : wishlistDisplay ? 'text-[17px]' : 'text-[18px]'} font-[500] tracking-[0.5px]`}> 
                      &#8377; {product.prices.length > 1 ? `${Math.min(...product.prices)} - ${Math.max(...product.prices)}` : product.prices[0]}
                </p>

                {
                  product.variantType &&
                    <p className="mt-[3px] text-[13px] text-muted font-[450]"> 
                        {`${camelToCapitalizedWords(product.variantType)}s:`} 
                      <span className='ml-[3px] text-[13px] capitalize'>
                        {product[`${product.variantType}s`].map(value=> 
                          ' ' + value + variantSymbol[`${product.variantType}`]
                          ).toString().trimEnd()
                        } 
                      </span>
                    </p>
                }

                 {
                    (
                      couponApplicableItems && couponApplicableItems?.categories?.length > 0 &&
                      couponApplicableItems.categories.some(category=> product.category.includes(category.name)) 
                    ) ||
                    ( couponApplicableItems && couponApplicableItems?.products?.length > 0 &&
                      couponApplicableItems.products.some(item=> item._id === product._id) 
                    ) &&
                        <p className='mt-[10px] w-fit px-[7px] py-[3px] text-[13px] text-secondary font-medium italic
                         bg-secondaryLight2 border rounded-[4px]'>
                          Coupon Eligible Product
                        </p>
                 } 

                {
                  wishlistDisplay && 
                  <div>
                    {product?.notes &&
                      <p className={`mt-[5px] flex items-center gap-[5px]`}> 
                        <div className='flex items-center gap-[4px] text-muted'>
                          <NotebookPen className='w-[12px] h-[12px]'/>
                          <span className='text-[12px] font-[500] tracking-[0.5px]'> Your Note: </span>
                        </div>
                        <span className='text-[12px] capitalize rounded-[3px]'> {product.notes} </span>
                      </p>
                    }
                    {product?.productPriority &&
                      <p className={`mt-[5px] flex items-center gap-[5px] text-[13px] font-[500] tracking-[0.5px]`}> 
                        <span className='text-[12px] capitalize flex items-center gap-[4px]'>
                          <ShieldAlert className='w-[14px] h-[14px] text-muted'/>
                          <div>
                            <span className='text-muted'> Priority: </span>
                            <span className={`${wishlistPriorityDetails.find(status=> status.value === product.productPriority).color}`}>
                              {wishlistPriorityDetails.find(status=> status.value === product.productPriority).name} 
                            </span>
                          </div>
                        </span>
                      </p>
                    }
                  </div>
                }
                {  
                  !gridView && 
                  <div className='mt-[10px]'>
                    {product.tags.map(tag=> 
                      <span className={`px-[14px] py-[1px] ${admin? 'text-[12px]' : wishlistDisplay? 'text-[11px]' : 'text-[13px]'} 
                        border-[1.5px]  border-[#eae0f0] rounded-[7px] text-secondary mr-[1rem]`}> 
                        {tag} 
                      </span>
                  )}
                </div>
              }

              </div>
            </div>
           
          </motion.div> 
        ))
        : <h3 className='mt-[12rem] text-[13px] xs-sm2:text-[16px] xs-sm:text-[17px] text-muted capitalize tracking-[0.5px]'> 
            No Products Available! 
          </h3>
      }
    </motion.div>
    { showByTable &&
      <div>

          <ProductsTableView products={products} />
          
      </div>
    }

    {
      selectedProductForWishlist &&
      <>

        <WishlistOptionsModal isOpen={isWishlistOptionsModalOpen} 
          onClose={()=> setIsWishlistOptionsModalOpen(false)} 
          product={selectedProductForWishlist} 
          setIsWishlistModalOpen={setIsWishlistModalOpen} 
          wishlist={wishlist}
        />
      
        <RemoveWishlistItemModal isOpen={isRemoveModalOpen} 
          onClose={()=> setIsRemoveModalOpen(false)} 
          product={selectedProductForWishlist}
          listName={selectedList} 
          removeProductFromWishlist={removeProductFromWishlist} 
        />

      </>
    }

    <WishlistModal isOpen={isWishlistModalOpen} 
      onClose={()=> setIsWishlistModalOpen(false)} 
    />

    <div className={` ${wishlistDisplay && 'ml-[1.5rem]'} `}>

      {/* <Pagination productCounts={productCounts} 
        currentPage={currentPage} 
        currentPageChanger={currentPageChanger} 
        limiter={limiter} 
      /> */}

      {
          products.length > 0 && totalPages && 
            <PaginationV2 currentPage={currentPage} totalPages={totalPages} onPageChange={(page)=> setCurrentPage(page)} />
      }

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
