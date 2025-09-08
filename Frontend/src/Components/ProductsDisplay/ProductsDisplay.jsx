import React, {useState, useEffect} from 'react'
import './ProductsDisplay.css'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import axios from 'axios'
import {toast} from 'react-toastify'
import {MdFavorite, MdFavoriteBorder} from "react-icons/md"
import {RiFileEditLine} from "react-icons/ri"
import {MdBlock} from "react-icons/md"
import {LuBadgeAlert} from "react-icons/lu"
import {Calendar, Tag, NotebookPen, ShieldAlert} from 'lucide-react'
import {format} from "date-fns"

import {getAllProducts, toggleProductStatus} from '../../Slices/productSlice'
import {addProductToList, removeProductFromList, getUserWishlist, getAllWishlistProducts, resetWishlistStates} from '../../Slices/wishlistSlice'
import WishlistModal from '../../Pages/User/WishlistPage/WishlistModal'
import WishlistOptionsModal from '../WishlistModals/WishlistOptionsModal'
import RemoveWishlistItemModal from '../WishlistModals/RemoveWishlistItemModal'
import Pagination from '../Pagination/Pagination'
import StarGenerator from '../StarGenerator/StarGenerator'
import {SiteButtonSquare} from '../SiteButtons/SiteButtons'
import {capitalizeFirstLetter} from '../../Utils/helperFunctions'
import {addToCart} from '../../Slices/cartSlice'
import ProductsTableView from './ProductsTableView'


export default function ProductsDisplay({gridView, showByTable, pageReader, limiter, queryOptions, showTheseProducts, admin, wishlistDisplay, currentList}) {

  const {currentPage, setCurrentPage} = pageReader

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
    if(wishlistDisplay){
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
      toast.success("The product have been added to the Wishlist!")
      dispatch(resetWishlistStates())
    }
    if(listProductRemoved){
      toast.success("The product have been removed from the Wishlist!")
      dispatch(resetWishlistStates())
      if(wishlistDisplay){
        dispatch( getAllWishlistProducts({queryOptions}) )
      }
    }
    if(wishlistError){
      toast.error(wishlistError)
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

  const currentPageChanger = (page)=>{
    setCurrentPage(page)
  }

  const handleAddToCart = (id)=> {
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
      
     <div 
      className={`${gridView ?
       'w-full grid gap-y-8 x-sm:grid-cols-2 xx-md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 x-xl:grid-cols-3 gap-x-[4rem] x-sm:gap-x-[4rem] xx-md:gap-x-[10rem] lg:gap-x-[9rem] xl:gap-x-[2rem]' 
       : showByTable 
       ? '' 
       : 'flex flex-col gap-[2rem]'}
       ${wishlistDisplay && 'ml-[1.5rem]'}`} 
        id="products-display" 
        style={admin ? { justifyItems: 'center' } : {}}
      >  

      { !showByTable && products.length > 0 ?
        products.map((product)=> (
          <div key={product._id} 
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
                onClick={()=> !admin && navigate('/shop/product', {state: {product}})}
              /> 
              <figcaption className={`${admin ? 'top-[2px] left-[-40px]' : 'bottom-[12px]'} absolute w-full text-center`}>
                {
                 admin ?
                  <div className='w-[35px] flex flex-col gap-[1rem] text-secondary'>
                    <span data-label='Edit' 
                      className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center 
                          relative cursor-pointer admin-control' 
                      onClick={()=> navigate('../edit', {state: {product}})}
                    >
                      <i> <RiFileEditLine/> </i>
                    </span>
                    <span data-label='Block' 
                      className='w-[30px] p-[5px] border rounded-[20px] z-[2] flex items-center justify-center
                         relative cursor-pointer admin-control' 
                      onClick={()=> dispatch(toggleProductStatus(product._id))}>
                      <i> <MdBlock/> </i>
                    </span>
                  </div>
                  :
                  <SiteButtonSquare clickHandler={()=> handleAddToCart(product._id)} 
                      customStyle={{paddingBlock: '8px'}}
                      tailwindClasses='w-[12rem] xx-md:w-[9rem] lg:w-[12rem] text-[15px] xx-md:text-[14px] lg:text-[15px]'
                  >
                       Add to Cart 
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
                onClick={()=> !admin && navigate('/shop/product', {state: {product}})}>
              <div>
              {product?.reviews ? 
                ( <p className='text-secondary flex items-center gap-[10px]'> 

                    <StarGenerator product={product} />

                    <span className='text-[13px]'> ({ product.reviews.length }) </span> 
                  </p>)
                : ( <p className='text-secondary'> No rating available! </p> )

                }
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
                  product.stock <= 5 &&
                  <p className='text-[13px] text-red-500 mb-[5px]'>
                     { product.stock <= 0 ? 'Out of Stock' :  `Only ${product.stock} items in Stock!`}
                  </p>
                }

                <p className={`${(admin && !gridView)
                  ? 'text-[16px]' 
                  : (gridView) 
                  ? 'text-[16px] xx-md:text-[15px] lg:text-[16px]' : wishlistDisplay ? 'text-[17px]' : 'text-[18px]'} font-[500] tracking-[0.5px]`}> 
                      &#8377; {product.price}
                </p>
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
           
          </div> 
        ))
        : <h3 className='text-[17px] text-muted text-center tracking-[0.5px]'> No Products Available! </h3>
      }
    </div>
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

      <Pagination productCounts={productCounts} 
        currentPage={currentPage} 
        currentPageChanger={currentPageChanger} 
        limiter={limiter} 
      />

    </div>
    <div className='h-[7rem] w-full'></div>
    </>
  )
}
